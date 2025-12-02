<?php

namespace App\Http\Controllers\Files;

use App\Http\Controllers\Controller;
use App\Models\Areas;
use App\Models\Programs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use ZipArchive;
use Illuminate\Support\Str;

class DownloadPerAreaFilesController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $area = Areas::findOrFail($request->area_id);
        // $program = Str::of($request->program_name)->replace('_', ' ')->title();
        $program = Programs::findOrFail($request->program_id)->load([
            'Levels' => function ($query) use ($request) {
                $query->where('accreditation_level_id', $request->level_id);
            }
        ]);
        /* $program = Programs::where('program_name', 'ILIKE', $program)
            ->with([
                'Levels' => function ($query) use ($request) {
                    $query->where('accreditation_level_id', $request->level_id);
                }
            ])->firstOrFail(); */

        $program_name = Str::slug($program->program_name, '_');
        $area_name = Str::slug($area->area_name, '_');
        $level = $program->Levels->first()->level;


        if (!$level) {
            return redirect()->back()
                ->with('type', 'error')
                ->with('title', 'Download Failed')
                ->with('message', 'Invalid program level specified for download.');
        }

        $folderPath = $program_name . '/level_' . $level . '/' . $area_name;

        $zipFileName = $program_name . '_level_' . $level . '_area_' . $area->area_number . '.zip';

        $files = Storage::disk('public')->allFiles($folderPath);


        if (empty($files)) {
            return redirect()->back()
                ->with('type', 'error')
                ->with('title', 'Download Failed')
                ->with('message', 'No files available for download in the selected area.');
        }

        $zip = new ZipArchive();
        $tempFile = tempnam(sys_get_temp_dir(), $zipFileName);


        if ($zip->open($tempFile, ZipArchive::CREATE) === TRUE) {
            foreach ($files as $file) {
                $relativePath = Str::after($file, $folderPath . '/');
                $absolutePath = Storage::disk('public')->path($file);
                $zip->addFile($absolutePath, $relativePath);
            }
            $zip->close();

            return response()
                ->download($tempFile, $zipFileName)
                ->deleteFileAfterSend(true);
        } else {
            return redirect()->back()
                ->with('type', 'error')
                ->with('title', 'Download Failed')
                ->with('message', 'Unable to create zip file for download.');
        }
    }
}

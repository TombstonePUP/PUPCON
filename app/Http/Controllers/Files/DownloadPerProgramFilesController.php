<?php

namespace App\Http\Controllers\Files;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Programs;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use ZipArchive;

class DownloadPerProgramFilesController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
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
        $level = $program->Levels->first()->level;

        if (!$level) {
            return redirect()->back()
                ->with('type', 'error')
                ->with('title', 'Download Failed')
                ->with('message', 'Invalid program level specified for download.');
        }

        $folderPath = $program_name . '/level_' . $level;
        $zipFileName = $program_name . '_level_' . $level . '_all_areas.zip';
        $files = Storage::disk('public')->allFiles($folderPath);

        if (empty($files)) {
            return redirect()->back()
                ->with('type', 'error')
                ->with('title', 'Download Failed')
                ->with('message', 'No files available for download in the selected program.');
        }

        $zip = new ZipArchive();
        $tempFile = tempnam(sys_get_temp_dir(), $zipFileName);

        if ($zip->open($tempFile, ZipArchive::CREATE) === TRUE) {
            foreach ($files as $file) {
                $relativeNameInZip = Str::after($file, $folderPath . '/');
                $absolutePath = Storage::disk('public')->path($file);
                $zip->addFile($absolutePath, $relativeNameInZip);
            }
            $zip->close();

            return response()->download($tempFile, $zipFileName)->deleteFileAfterSend(true);
        } else {
            return redirect()->back()
                ->with('type', 'error')
                ->with('title', 'Download Failed')
                ->with('message', 'Could not create ZIP file for download.');
        }

    }
}

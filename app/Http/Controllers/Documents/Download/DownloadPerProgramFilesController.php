<?php

namespace App\Http\Controllers\Documents\Download;

use App\Http\Controllers\Controller;
use App\Models\Programs;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use ZipArchive;

class DownloadPerProgramFilesController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): RedirectResponse|BinaryFileResponse
    {
        $program = Programs::findOrFail($request->program_id)->load([
            'Levels' => function ($query) use ($request) {
                $query->where('accreditation_level_id', $request->level_id);
            },
        ]);

        $program_name = Str::slug($program->program_name, '_');
        $degree_type = Str::slug($program->degree_type, '_');
        $level = $program->Levels->first();
        $levelLabel = $level->level === 0 ? 'psv' : 'level_'.$level->level;

        if (! $level) {
            return redirect()->back()
                ->with('type', 'error')
                ->with('title', 'Download Failed')
                ->with('message', 'No accreditation level found for this program.');
        }

        $folderPath = "documents/{$degree_type}_{$program_name}/{$levelLabel}";
        $zipFileName = "{$program_name}_{$levelLabel}_all_areas.zip";
        $files = Storage::disk('public')->allFiles($folderPath);

        if (empty($files)) {
            return redirect()->back()
                ->with('type', 'error')
                ->with('title', 'Download Failed')
                ->with('message', 'No files available for download in the selected program.');
        }

        $zip = new ZipArchive;
        $tempFile = tempnam(sys_get_temp_dir(), $zipFileName);

        if ($zip->open($tempFile, ZipArchive::CREATE) === true) {
            foreach ($files as $file) {
                $relativeNameInZip = Str::after($file, $folderPath.'/');
                $absolutePath = Storage::disk('public')->path($file);
                $zip->addFile($absolutePath, $relativeNameInZip);
            }
            $zip->close();

            return response()
                ->download($tempFile, $zipFileName)
                ->deleteFileAfterSend(true);
        }

        return redirect()->back()
            ->with('type', 'error')
            ->with('title', 'Download Failed')
            ->with('message', 'Could not create ZIP file for download.');
    }
}

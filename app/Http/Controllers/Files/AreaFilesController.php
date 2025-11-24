<?php

namespace App\Http\Controllers\Files;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\AreaFiles;
use App\Models\AreaFormCategory;
use App\Models\Areas;
use App\Models\FileStatus;
use App\Models\ParameterOutlineCategory;
use App\Models\ParameterOutlines;
use App\Models\Programs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Mostafaznv\PdfOptimizer\Laravel\Facade\PdfOptimizer;


class AreaFilesController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate(
            [
                'outline_id' => 'nullable|exists:parameter_outlines,parameter_outline_id',
                'document' => 'required|file|mimes:pdf'
            ],
            [
                'outline_id.exists' => 'The selected outline does not exist.',
                'document.required' => 'Please upload a PDF document.',
                'document.file' => 'The uploaded file must be a valid file.',
                'document.pdf' => 'The uploaded file must be a PDF document.'
            ]
        );

        $program = Str::of($request->program_name)->replace('_', ' ')->title();
        $program = Programs::where('program_name', $program)->first();
        $level = $program->Levels->where('accreditation_level_id', $request->level_id)->first();
        $level = $level->level === 0 ? 'Preliminiary Survey Visit' : $level->level;
        $area = Areas::where('area_id', $request->area_id)->first();
        $parameterOutlines = ParameterOutlines::find($validated['outline_id']);

        $user = Auth::user();
        if ($user->Roles->role_name === 'Coordinator' || $user->Roles->role_name === 'Admin') {
            $fileStatus = FileStatus::where('status_name', 'Approved')->first()->file_status_id;
        } else {
            $fileStatus = FileStatus::where('status_name', 'Pending')->first()->file_status_id;
        }

        $activityLog = new ActivityLog();
        if ($file = $parameterOutlines->AreaFiles) {
            Storage::disk('public')->delete($file->file_path);
            $file->delete();
            $activityLog->activity = 'Update Document';
        } else {
            $activityLog->activity = 'Upload Document';
        }

        $categoryName = $parameterOutlines->parameterOutlineCategory->category_name;
        $parameterName = $parameterOutlines->AreaParameter->parameter_name;
        if ($categoryName === 'No Category') {
            $initial = substr($parameterName, 0, 1);
        } else {
            $initial = substr($categoryName, 0, 1);
        }
        $categoryName = $categoryName === "Outcome/s" ? substr($categoryName, 0, -2) : $categoryName;

        $file = $validated['document'];
        $parameter_outline = Str::slug($parameterOutlines->outline_description, '_');
        $fileName = $initial . '.' . $parameterOutlines->outline_number . '.' . $parameter_outline . '.' . $file->getClientOriginalExtension();
        $program_name = Str::slug($program->program_name, '_');
        $area_name = Str::slug($area->area_name, '_');
        $parameter_name = Str::slug($parameterName, '_');
        $category_name = Str::slug($categoryName, '_');
        $filePath = "{$program_name}/level_{$level}/{$area_name}/{$parameter_name}/{$category_name}";

        // Ensure temp directory exists
        if (!Storage::disk('public')->exists('temp')) {
            Storage::disk('public')->makeDirectory('temp');
        }

        // Store original file temporarily
        $tempFileName = 'temp_' . Str::uuid() . '.pdf';
        $tempFilePath = "temp/{$tempFileName}";
        Storage::disk('public')->putFileAs('temp', $file, $tempFileName);

        Log::info('Temp file created: ' . $tempFilePath);
        Log::info('Temp file size: ' . Storage::disk('public')->size($tempFilePath) . ' bytes');

        // Optimize PDF
        try {
            Log::info('Starting PDF optimization...');
            $customTempPath = str_replace('/', '\\', storage_path('app/public/temp'));
            putenv('TMP=' . $customTempPath);
            putenv('TEMP=' . $customTempPath);

            Log::info('Using custom TEMP/TMP path: ' . $customTempPath);

            $result = PdfOptimizer::fromDisk('public')
                ->open($tempFilePath)
                ->toDisk('public')
                ->optimize("{$filePath}/{$fileName}");

            Log::info('Optimization status: ' . ($result->status ? 'SUCCESS' : 'FAILED'));
            Log::info('Optimization message: ' . $result->message);

            if (Storage::disk('public')->exists("{$filePath}/{$fileName}")) {
                Log::info('Optimized file created successfully');
                Log::info('Optimized file size: ' . Storage::disk('public')->size("{$filePath}/{$fileName}") . ' bytes');
            } else {
                Log::error('Optimized file NOT found!');
            }

            // Delete temporary file
            Storage::disk('public')->delete($tempFilePath);
            Log::info('Temp file deleted');

            if (!$result->status) {
                Storage::disk('public')->putFileAs($filePath, $file, $fileName);
                Log::warning('PDF optimization failed, using original file: ' . $result->message);
            }
        } catch (\Exception $e) {
            Storage::disk('public')->delete($tempFilePath);
            Storage::disk('public')->putFileAs($filePath, $file, $fileName);
            Log::error('PDF optimization error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
        }

        $areaFile = $parameterOutlines->AreaFiles()->create([
            'file_name' => $fileName,
            'file_path' => "{$filePath}/{$fileName}",
            'file_status_id' => $fileStatus,
            'uploaded_by' => $user->user_id,
            'uploaded_at' => now(),
        ]);

        $activityLog->user_id = $user->user_id;
        $activityLog->area = $area->area_name;
        $activityLog->program = $program->program_name;
        $activityLog->activity_date = now();
        $activityLog->file_name = $fileName;
        $activityLog->save();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Upload Successful')
            ->with('message', 'The Document has been uploaded.');
    }

    /**
     * Download the specified resource from storage.
     */
    public function download(Request $request)
    {
        $parameterOutlines = ParameterOutlines::where('parameter_outline_id', $request->outline_id)->first();
        $areaFile = $parameterOutlines->AreaFiles;

        if ($areaFile && Storage::disk('public')->exists($areaFile->file_path)) {
            return Storage::disk('public')->download($areaFile->file_path, $areaFile->file_name);
        } else {
            return redirect()->back()
                ->with('type', 'error')
                ->with('title', 'Download Failed')
                ->with('message', 'There is an error in downloading the document.');
        }
    }

    /**
     * Destroy the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $parameterOutlines = ParameterOutlines::where('parameter_outline_id', $request->outline_id)->first();
        $areaFile = $parameterOutlines->AreaFiles;
        $user = Auth::user();
        $area = Areas::where('area_id', $request->area_id)->first();
        $program = Str::of($request->program_name)->replace('_', ' ')->title();
        $program = Programs::where('program_name', $program)->first();

        if ($areaFile) {
            Storage::disk('public')->delete($areaFile->file_path);
            $areaFile->delete();

            $activityLog = new ActivityLog();
            $activityLog->activity = "Delete Document";
            $activityLog->user_id = $user->user_id;
            $activityLog->area = $area->area_name;
            $activityLog->program = $program->program_name;
            $activityLog->activity_date = now();
            $activityLog->file_name = $areaFile->file_name;
            $activityLog->save();
        }

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Delete Successful')
            ->with('message', 'The Document has been deleted.');
    }
}

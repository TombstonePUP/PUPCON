<?php

namespace App\Http\Controllers\Areas\Files;

use App\Enums\ActivityLogAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Areas\StoreAreaFileRequest;
use App\Models\AccreditationLevels;
use App\Models\Areas;
use App\Models\FileStatus;
use App\Models\ParameterOutlines;
use App\Models\Programs;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AreaFilesController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAreaFileRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $program = Programs::with([
            'Levels' => function ($query) use ($request) {
                $query->where('accreditation_level_id', $validated['level_id']);
            },
        ])->findOrFail($request->program_id);

        $level = AccreditationLevels::where('accreditation_level_id', $validated['level_id'])->firstOrFail();
        $level = $level->level === 0 ? 'psv' : 'level_' . $level->level;

        $area = Areas::findOrFail($validated['area_id']);
        $parameterOutlines = ParameterOutlines::find($validated['outline_id']);

        $user = Auth::user();
        if ($user->Roles->role_name === 'Coordinator' || $user->Roles->role_name === 'Admin') {
            $fileStatus = FileStatus::where('status_name', 'Approved')->first()->file_status_id;
        } else {
            $fileStatus = FileStatus::where('status_name', 'Pending')->first()->file_status_id;
        }

        if ($file = $parameterOutlines->AreaFiles) {
            Storage::disk('s3')->delete($file->file_path);
            $file->delete();
            $activity = ActivityLogAction::Update;
        } else {
            $activity = ActivityLogAction::Upload;
        }

        $categoryName = $parameterOutlines->parameterOutlineCategory->category_name;
        $parameterName = $parameterOutlines->AreaParameter->parameter_name;
        if ($categoryName === 'No Category') {
            $initial = substr($parameterName, 0, 1);
        } else {
            $initial = substr($categoryName, 0, 1);
        }
        $categoryName = $categoryName === 'Outcome/s' ? substr($categoryName, 0, -2) : $categoryName;

        $file = $validated['document'];
        $parameter_outline = Str::slug($parameterOutlines->outline_description, '_');
        $fileName = $initial . '.' . $parameterOutlines->outline_number . '.' . $parameter_outline . '.' . $file->getClientOriginalExtension();
        $program_name = Str::slug($program->program_name, '_');
        $degree_type = Str::slug($program->degree_type, '_');
        $area_name = Str::slug($area->area_name, '_');
        $parameter_name = Str::slug($parameterName, '_');
        $category_name = Str::slug($categoryName, '_');
        $filePath = "documents/{$degree_type}_{$program_name}/{$level}/{$area_name}/{$parameter_name}/{$category_name}";

        DB::transaction(function () use (
            $activity,
            $file,
            $filePath,
            $fileName,
            $fileStatus,
            $user,
            $parameterOutlines,
            $program,
            $area
        ) {

            $file->storeAs($filePath, $fileName, 's3');

            $parameterOutlines->AreaFiles()->create([
                'file_name' => $fileName,
                'file_path' => "{$filePath}/{$fileName}",
                'file_status_id' => $fileStatus,
                'uploaded_by' => $user->user_id,
                'uploaded_at' => now(),
            ]);

            $activity_description = "{$activity->activity} for
                '{$parameterOutlines->outline_description}' in
                {$program->program_name} - {$area->area_name}.";

            ActivityLogService::fileManagementLog(
                activity: $activity,
                userId: $user->user_id,
                description: $activity_description,
            );
        });

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Upload Successful')
            ->with('message', 'The Document has been uploaded.');
    }

    /**
     * Download the specified resource from storage.
     */
    public function download(Request $request): RedirectResponse
    {
        $parameterOutlines = ParameterOutlines::where('parameter_outline_id', $request->outline_id)->first();
        $areaFile = $parameterOutlines->AreaFiles;

        if ($areaFile && Storage::disk('s3')->exists($areaFile->file_path)) {
            return response()->download(storage_path('app/public/' . $areaFile->file_path), $areaFile->file_name);
        } else {
            return redirect()->back()
                ->with('type', 'error')
                ->with('title', 'Download Failed')
                ->with('message', 'There is an error in downloading the document.');
        }
    }

    /**
     * Destroy the specified resource from storage.
     *
     * @return RedirectResponse
     */
    public function destroy(Request $request)
    {
        $areaFile = ParameterOutlines::find($request->outline_id)?->AreaFiles;

        if (!$areaFile) {
            return redirect()->back()
                ->with('type', 'success')
                ->with('title', 'Delete Successful')
                ->with('message', 'The Document has been deleted.');
        }

        $user = Auth::user();

        Storage::disk('s3')->delete($areaFile->file_path);

        ActivityLogService::fileManagementLog(
            activity: ActivityLogAction::Delete,
            userId: $user->user_id,
            description: "Deleted file: {$areaFile->file_name}",
        );

        $areaFile->delete();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Delete Successful')
            ->with('message', 'The Document has been deleted.');
    }
}

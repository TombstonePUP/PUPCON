<?php

namespace App\Http\Controllers\Areas\Forms;

use App\Enums\ActivityLogAction;
use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\AreaForms;
use App\Models\Areas;
use App\Models\FileStatus;
use App\Models\Programs;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AreaFormFilesController extends Controller
{
    /**
     * Update/Upload the specified resource in storage.
     *
     * @return void
     */
    public function store(Request $request, AreaForms $areaForms): RedirectResponse
    {
        $validated = $request->validate(
            [
                'document' => 'required|file|mimes:pdf',
            ],
            [
                'document.required' => 'Please upload a PDF document.',
                'document.file' => 'The uploaded file must be a valid file.',
                'document.pdf' => 'The uploaded file must be a PDF document.',
            ]
        );

        $user = Auth::user();
        $area = Areas::where('area_id', $request->area_id)->first();
        // $program = Str::of($request->program_name)->replace('_', ' ')->title();
        $program = Programs::with('Levels')->findOrFail($request->program_id);

        $level = $program->Levels
            ->where('accreditation_level_id', $request->level_id)
            ->first();

        $level = $level->level === 0
            ? 'psv'
            : 'level_'.$level->level;

        if ($user->Roles->role_name === 'Coordinator' || $user->Roles->role_name === 'Admin') {
            $status = FileStatus::where('status_name', 'Approved')->first()->file_status_id;
        } else {
            $status = FileStatus::where('status_name', 'Pending')->first()->file_status_id;
        }

        $areaForm = $areaForms->find($request->form_id);

        if ($file = $areaForm->file_path) {
            Storage::disk('public')->delete($file);
            $activity = ActivityLogAction::Update;
        } else {
            $activity = ActivityLogAction::Upload;
        }

        $file = $validated['document'];
        $category = $areaForm->AreaFormCategory->category_name;

        $category = Str::slug($category, '_');
        $program_name = Str::slug($program->program_name, '_');
        $degree_type = Str::slug($program->degree_type, '_');
        $area_name = Str::slug($area->area_name, '_');
        $formFileName = "{$category}.{$file->getClientOriginalExtension()}";
        $formFilePath = "documents/{$degree_type}_{$program_name}/{$level}/{$area_name}/area_forms";

        DB::transaction(function () use (
            $activity,
            $user,
            $program,
            $area,
            $formFileName,
            $formFilePath,
            $areaForm,
            $status,
            $file
        ) {
            $file->storeAs($formFilePath, $formFileName, 'public');

            $formFilePath = "{$formFilePath}/{$formFileName}";
            $areaForm->file_name = $formFileName;
            $areaForm->file_path = $formFilePath;
            $areaForm->uploaded_by = $user->user_id;
            $areaForm->uploaded_at = now();
            $areaForm->file_status_id = $status;

            $activity_description = "{$activity} for '{$area->area_name}' in program '{$program->program_name}'.";

            ActivityLogService::fileManagementLog(
                activity: $activity,
                userId: $user->user_id,
                description: $activity_description
            );
        });

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'File Uploaded')
            ->with('message', 'Area form file uploaded successfully.');
    }

    /**
     * Download the specified resource from storage.
     *
     * @return <missing>|RedirectResponse
     */
    public function download(Request $request): RedirectResponse
    {
        $form = AreaForms::where('area_form_id', $request->form_id)->first();

        if ($form && Storage::disk('public')->exists($form->file_path)) {
            return Storage::disk('public')->download($form->file_path, $form->file_name);
        } else {
            return redirect()->back()
                ->with('type', 'error')
                ->with('title', 'Download Failed')
                ->with('message', 'There is an error in downloading the document.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, AreaForms $areaForms): RedirectResponse
    {
        $areaForm = $areaForms->find($request->form_id);
        $user = Auth::user();
        $area = Areas::where('area_id', $request->area_id)->first();
        $program = Programs::findOrFail($request->program_id);

        Storage::disk('public')->delete($areaForm->file_path);

        $activityLog = new ActivityLog;
        $activityLog->user_id = $user->user_id;
        $activityLog->activity = 'Delete';
        $activityLog->description = "Deleted area form for '{$area->area_name}' in program '{$program->program_name}'.";
        $activityLog->type = 'Files';
        $activityLog->activity_date = now();
        $activityLog->save();

        $areaForm->file_name = null;
        $areaForm->file_path = null;
        $areaForm->uploaded_by = null;
        $areaForm->uploaded_at = null;
        $areaForm->save();

        return redirect()->back()
            ->with('success', 'Area form deleted successfully.');
    }
}

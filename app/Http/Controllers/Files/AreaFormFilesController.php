<?php

namespace App\Http\Controllers\Files;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\AreaFormCategory;
use App\Models\AreaForms;
use App\Models\Programs;
use App\Models\Areas;
use App\Models\FileStatus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use function Symfony\Component\Clock\now;

class AreaFormFilesController extends Controller
{
    /**
     * Update/Upload the specified resource in storage.
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
                'document.pdf' => 'The uploaded file must be a PDF document.'
            ]
        );

        $user = Auth::user();
        $area = Areas::where('area_id', $request->area_id)->first();
        $program = Str::of($request->program_name)->replace('_', ' ')->title();
        $program = Programs::where('program_name', $program)->with('Levels')->first();
        $level = $program->Levels->where('accreditation_level_id', $request->level_id)->first();
        $level = $level->level === 0 ? 'Preliminiary Survey Visit' : $level->level;
        if ($user->Roles->role_name === 'Coordinator' || $user->Roles->role_name === 'Admin') {
            $status = FileStatus::where('status_name', 'Approved')->first()->file_status_id;
        } else {
            $status = FileStatus::where('status_name', 'Pending')->first()->file_status_id;
        }

        $areaForm = $areaForms->find($request->form_id);
        $category = $areaForm->AreaFormCategory->category_name;

        $activityLog = new ActivityLog();
        if ($file = $areaForm->file_path) {
            Storage::disk('public')->delete($file);
            $activityLog->activity = "Update Document";
        } else {
            $activityLog->activity = "Upload Document";
        }

        $category = Str::slug($category, '_');
        $program_name = Str::slug($program->program_name, '_');
        $area_name = Str::slug($area->area_name, '_');
        $formFileName = "{$category}.{$validated['document']->getClientOriginalExtension()}";
        $formFilePath = "{$program_name}/level_{$level}/{$area_name}/area_forms/files";
        $request->file('document')->storeAs($formFilePath, $formFileName, 'public');

        $formFilePath = "{$formFilePath}/{$formFileName}";
        $areaForm->file_name = $formFileName;
        $areaForm->file_path = $formFilePath;
        $areaForm->uploaded_by = $user->user_id;
        $areaForm->uploaded_at = now();
        $areaForm->file_status_id = $status;

        $activityLog->user_id = $user->user_id;
        $activityLog->area = $area->area_name;
        $activityLog->program = $program->program_name;
        $activityLog->file_name = $formFileName;
        $activityLog->activity_date = now();
        $activityLog->save();

        /* if ($request->hasFile('form_image')) {
            if($file = $areaForm->form_image_path) {
                Storage::disk('public')->delete($file);
            }
            $formImageName = "{$area->area_name}-{$category}-form-image.{$validated->file('form_image')->getClientOriginalExtension()}";
            $formImagePath = "{$program}/{$area->area_name}/area-forms/images";
            $validated->file('form_image')->storeAs($formImagePath, $formImageName, 'public');
            $formImagePath = "{$program}/{$area->area_name}/area-forms/images/{$formImageName}";
        } */

        $areaForm->save();

        return redirect()->back()
            ->with('success', 'Area form updated successfully.');
    }

    /**
     * Download the specified resource from storage.
     */
    public function download(Request $request)
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
    public function destroy(Request $request, AreaForms $areaForms)
    {
        $areaForm = $areaForms->find($request->form_id);
        $user = Auth::user();
        $area = Areas::where('area_id', $request->area_id)->first();
        $program = $request->program_name;

        Storage::disk('public')->delete($areaForm->file_path);

        $activityLog = new ActivityLog();
        $activityLog->user_id = $user->user_id;
        $activityLog->area = $area->area_name;
        $activityLog->program = $program;
        $activityLog->file_name = $areaForm->file_name;
        $activityLog->activity = "Delete Document";
        $activityLog->activity_date = now();
        $activityLog->save();

        $areaForm->file_name = null;
        $areaForm->file_path = null;
        $areaForm->uploaded_by = null;
        $areaForm->uploaded_at = null;

        return redirect()->back()
            ->with('success', 'Area form deleted successfully.');
    }
}

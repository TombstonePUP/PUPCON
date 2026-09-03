<?php

namespace App\Http\Controllers\Areas\Forms;

use App\Enums\ActivityLogAction;
use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\AreaFormCategory;
use App\Models\AreaForms;
use App\Models\Areas;
use App\Models\FileStatus;
use App\Models\Programs;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

use function Symfony\Component\Clock\now;

class AreaFormsController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate(
            [
                'area_form_category_id' => 'required|integer|exists:area_form_categories,area_form_category_id',
                'document' => 'nullable|file|mimes:pdf|max:10240',
                'program_id' => 'required|integer|exists:programs,program_id',
                'level_id' => 'required|integer|exists:accreditation_levels,accreditation_level_id',
                'area_id' => 'required|integer|exists:areas,area_id',
            ],
            [
                'area_form_category_id.required' => 'Form category ID is required.',
                'area_form_category_id.integer' => 'Form category ID must be an integer.',
                'area_form_category_id.exists' => 'The selected form category does not exist.',
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

        $category = AreaFormCategory::where('area_form_category_id', $validated['area_form_category_id'])
            ->first()->category_name;

        $areaForm = new AreaForms;

        if ($request->hasFile('document')) {
            $category = Str::slug($category, '_');
            $program_name = Str::slug($program->program_name, '_');
            $degree_type = Str::slug($program->degree_type, '_');
            $area_name = Str::slug($area->area_name, '_');
            $formFileName = "{$category}.{$validated['document']->getClientOriginalExtension()}";
            $formFilePath = "documents/{$degree_type}_{$program_name}/{$level}/{$area_name}/area_forms";
            $request->file('document')->storeAs($formFilePath, $formFileName, 's3');

            $formFilePath = "{$formFilePath}/{$formFileName}";
            // Populate the areaForm model
            $areaForm->file_name = $formFileName;
            $areaForm->file_path = $formFilePath;
            $areaForm->uploaded_by = $user->user_id;
            $areaForm->uploaded_at = now();
            $areaForm->file_status_id = $status;
            // Log the activity
            $activityLog = new ActivityLog;
            $activityLog->user_id = $user->user_id;
            $activityLog->description = "Uploaded area form for '{$area->area_name}' in program '{$program->program_name}'.";
            $activityLog->activity = 'Upload';
            $activityLog->type = 'Files';
            $activityLog->activity_date = now();
            $activityLog->save();
        }

        $areaForm->area_id = $area->area_id;
        $areaForm->area_form_category_id = $validated['area_form_category_id'];

        $areaForm->save();

        $activityLog = new ActivityLog;
        $activityLog->user_id = $user->user_id;
        $activityLog->description = "Created area form entry for '{$area->area_name}' in program '{$program->program_name}'.";
        $activityLog->activity = 'Create';
        $activityLog->type = 'Files';
        $activityLog->activity_date = now();
        $activityLog->save();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Area Form Uploaded')
            ->with('message', 'The area form has been uploaded successfully.');
    }

    /**
     * Remove the specified file resource from storage.
     *
     * @return void
     */
    public function destroy(Request $request, AreaForms $areaForms): RedirectResponse
    {
        $areaForm = $areaForms->find($request->form_id);
        $user = Auth::user();
        $area = Areas::where('area_id', $request->area_id)->first();
        $program = Programs::findOrFail($request->program_id);

        if ($areaForm->file_path) {
            $file_name = $areaForm->file_name;
            $description = "Deleted area form file {$file_name} for '{$area->area_name}' in program '{$program->program_name}'.";
            Storage::disk('s3')->delete($areaForm->file_path);
            ActivityLogService::fileManagementLog(
                activity: ActivityLogAction::Delete,
                userId: $user->user_id,
                description: $description,
            );
        }

        $description = "Deleted area form for '{$area->area_name}' in program '{$program->program_name}'.";
        ActivityLogService::contentManagementLog(
            activity: ActivityLogAction::Delete,
            userId: $user->user_id,
            description: $description,
        );

        $areaForm->delete();

        return redirect()->back()
            ->with('success', 'Area form deleted successfully.');
    }
}

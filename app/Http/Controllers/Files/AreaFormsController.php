<?php

namespace App\Http\Controllers\Files;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\AreaFormCategory;
use App\Models\AreaForms;

use App\Models\Areas;
use App\Models\FileStatus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use function Symfony\Component\Clock\now;

class AreaFormsController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'area_id' => 'required|integer|exists:areas,area_id',
            'area_form_category_id' => 'required|integer|exists:area_form_categories,area_form_category_id',
            'form_image' => 'nullable|file|mimes:jpg,jpeg,png',
            'document' => 'nullable|file|mimes:pdf',
        ]);

        $user = Auth::user();

        $area = Areas::where('area_id', $validated['area_id'])->first();
        $program = $request->program_name;

        $category = AreaFormCategory::where('area_form_category_id', $validated['area_form_category_id'])
            ->first()->category_name;

        $pending = FileStatus::where('status_name', 'Pending')->first()->file_status_id;

        $areaForm = new AreaForms();

        if ($request->hasFile('document')) {
            $formFileName = "{$category}.{$validated['document']->getClientOriginalExtension()}";
            $formFilePath = "{$program}/{$area->area_name}/area-forms/files";
            $request->file('document')->storeAs($formFilePath, $formFileName, 'public');
            $formFilePath = "{$formFilePath}/{$formFileName}";
            //Populate the areaForm model
            $areaForm->file_name = $formFileName;
            $areaForm->file_path = $formFilePath;
            $areaForm->uploaded_by = $user->user_id;
            $areaForm->uploaded_at = now();
            $areaForm->file_status_id = $pending;
            //Log the activity
            $activityLog = new ActivityLog();
            $activityLog->user_id = $user->user_id;
            $activityLog->area = $area->area_name;
            $activityLog->program = $program;
            $activityLog->file_name = $formFileName;
            $activityLog->activity = "Upload Document";
            $activityLog->activity_date = now();
            $activityLog->save();
        }

        /* if ($request->hasFile('form_image')) {
            $formImageName = "{$area->area_name}-{$category}-form-image.{$validated->file('form_image')->getClientOriginalExtension()}";
            $formImagePath = "{$program}/{$area->area_name}/area-forms/images";
            $validated->file('form_image')->storeAs($formImagePath, $formImageName, 'public');
            $formImagePath = "{$program}/{$area->area_name}/area-forms/images/{$formImageName}";
        } */

        $areaForm->area_id = $validated['area_id'];
        $areaForm->area_form_category_id = $validated['area_form_category_id'];

        $areaForm->save();

        return redirect()->back()
            ->with('success', 'Area form created successfully.');
    }

    /**
     * Display the specified resource.
     * @return void
     */
    public function show(AreaForms $areaForms): void
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     * @return void
     */
    public function edit(AreaForms $areaForms): void
    {
        //
    }

    /**
     * Update the specified resource in storage.
     * @return void
     */
    public function update(Request $request, AreaForms $areaForms): RedirectResponse
    {
        $validated = $request->validate([
            'area_form_id' => 'required|integer|exists:area_forms,area_form_id',
            'area_id' => 'required|integer|exists:areas,area_id',
            // 'area_form_category_id' => 'required|integer|exists:area_form_categories,area_form_category_id',
            'form_image' => 'nullable|file|mimes:jpg,jpeg,png',
            'form_file' => 'required|file|mimes:pdf',
        ]);

        $user = Auth::user();

        $area = Areas::where('area_id', $validated['area_id'])->first();
        $program = $request->program_name;

        /* $category = AreaFormCategory::where('area_form_category_id', $validated['area_form_category_id'])
            ->first()->category_name; */
        $pending = FileStatus::where('status_name', 'Pending')->first()->file_status_id;

        $areaForm = $areaForms->find($validated['area_form_id']);
        $category = $areaForm->AreaFormCategory->category_name;

        if ($request->hasFile('form_file')) {
            $activityLog = new ActivityLog();
            if($file = $areaForm->file_path) {
                Storage::disk('public')->delete($file);
                $activityLog->activity = "Update Document";
            } else {
                $activityLog->activity = "Upload Document";
            }
            $formFileName = "{$category}.{$validated['form_file']->getClientOriginalExtension()}";
            $formFilePath = "{$program}/{$area->area_name}/area-forms/files";
            $request->file('form_file')->storeAs($formFilePath, $formFileName, 'public');
            $formFilePath = "{$formFilePath}/{$formFileName}";
            $areaForm->file_name = $formFileName;
            $areaForm->file_path = $formFilePath;
            $areaForm->file_status_id = $pending;
            $activityLog->user_id = $user->user_id;
            $activityLog->area = $area->area_name;
            $activityLog->program = $program;
            $activityLog->file_name = $formFileName;
            $activityLog->activity_date = now();
            $activityLog->save();
        }

        /* if ($request->hasFile('form_image')) {
            if($file = $areaForm->form_image_path) {
                Storage::disk('public')->delete($file);
            }
            $formImageName = "{$area->area_name}-{$category}-form-image.{$validated->file('form_image')->getClientOriginalExtension()}";
            $formImagePath = "{$program}/{$area->area_name}/area-forms/images";
            $validated->file('form_image')->storeAs($formImagePath, $formImageName, 'public');
            $formImagePath = "{$program}/{$area->area_name}/area-forms/images/{$formImageName}";
        } */

        // $areaForm->area_form_category_id = $validated['area_form_category_id'];

        $areaForm->save();

        return redirect()->back()
            ->with('success', 'Area form updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     * @return void
     */
    public function destroy(Request $request, AreaForms $areaForms): RedirectResponse
    {
        $areaForm = $areaForms->find($request->form_id);
        $user = Auth::user();
        $area = Areas::where('area_id', $request->area_id)->first();
        $program = $request->program_name;

        if ($areaForm->file_path) {
            Storage::disk('public')->delete($areaForm->file_path);
            $activityLog = new ActivityLog();
            $activityLog->user_id = $user->user_id;
            $activityLog->area = $area->area_name;
            $activityLog->program = $program;
            $activityLog->file_name = $areaForm->file_name;
            $activityLog->activity = "Delete Document";
            $activityLog->activity_date = now();
            $activityLog->save();
        }

        $areaForm->delete();

        return redirect()->back()
            ->with('success', 'Area form deleted successfully.');
    }
}

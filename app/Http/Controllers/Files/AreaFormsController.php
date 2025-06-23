<?php

namespace App\Http\Controllers\Files;

use App\Http\Controllers\Controller;
use App\Models\AreaFormCategory;
use App\Models\AreaForms;

use App\Models\Areas;
use App\Models\FileStatus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AreaFormsController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return void
     */
    public function index(): void
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     * @return void
     */
    public function create(): void
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'area_id' => 'required|integer|exists:areas,area_id',
            'area_form_category_id' => 'required|integer|exists:area_form_categories,area_form_category_id',
            'form_image' => 'nullable|file|mimes:jpg,jpeg,png',
            'form_file' => 'nullable|file|mimes:pdf',
        ]);

        $area = Areas::where('area_id', $validated['area_id'])->first();
        $program = $request->program_name;

        $category = AreaFormCategory::where('area_form_category_id', $validated['area_form_category_id'])
            ->first()->category_name;

        $pending = FileStatus::where('status_name', 'Pending')->first()->file_status_id;

        $areaForm = new AreaForms();

        if ($request->hasFile('form_file')) {
            $formFileName = "{$category}.{$validated['form_file']->getClientOriginalExtension()}";
            $formFilePath = "{$program}/{$area->area_name}/area-forms/files";
            $request->file('form_file')->storeAs($formFilePath, $formFileName, 'public');
            $formFilePath = "{$formFilePath}/{$formFileName}";
            $areaForm->file_name = $formFileName;
            $areaForm->file_path = $formFilePath;
            $areaForm->file_status_id = $pending;
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
            'area_form_category_id' => 'required|integer|exists:area_form_categories,area_form_category_id',
            'form_image' => 'nullable|file|mimes:jpg,jpeg,png',
            'form_file' => 'nullable|file|mimes:pdf',
        ]);

        $area = Areas::where('area_id', $validated['area_id'])->first();
        $program = $request->program_name;

        $category = AreaFormCategory::where('area_form_category_id', $validated['area_form_category_id'])
            ->first()->category_name;
        $pending = FileStatus::where('status_name', 'Pending')->first()->file_status_id;

        $areaForm = $areaForms->find($validated['area_form_id']);

        if ($request->hasFile('form_file')) {
            if($file = $areaForm->file_path) {
                Storage::disk('public')->delete($file);
            }
            $formFileName = "{$category}.{$validated['form_file']->getClientOriginalExtension()}";
            $formFilePath = "{$program}/{$area->area_name}/area-forms/files";
            $request->file('form_file')->storeAs($formFilePath, $formFileName, 'public');
            $formFilePath = "{$formFilePath}/{$formFileName}";
            $areaForm->file_name = $formFileName;
            $areaForm->file_path = $formFilePath;
            $areaForm->file_status_id = $pending;
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

        $areaForm->area_form_category_id = $validated['area_form_category_id'];

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
        if ($areaForm->file_path) {
            Storage::disk('public')->delete($areaForm->file_path);
        }
        $areaForm->delete();

        return redirect()->back()
            ->with('success', 'Area form deleted successfully.');
    }
}

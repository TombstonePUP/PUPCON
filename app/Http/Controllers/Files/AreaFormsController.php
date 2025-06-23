<?php

namespace App\Http\Controllers\Files;

use App\Http\Controllers\Controller;
use App\Models\AreaFormCategory;
use App\Models\AreaForms;

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
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     * @return void
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        dd($request->all());
        $validated = $request->validate([
            'area_id' => 'required|integer|exists:areas,area_id',
            'area_form_category_id' => 'required|integer|exists:area_form_categories,area_form_category_id',
            'form_image' => 'nullable|file|mimes:jpg,jpeg,png',
            'form_file' => 'nullable|file|mimes:pdf',
        ]);

        $area = AreaForms::where('area_id', $validated['area_id'])->first();
        $program = $request->program_name;

        $category = AreaFormCategory::where('area_form_category_id', $validated['area_form_category_id'])
            ->first()->category_name;
        $pending = FileStatus::where('status_name', 'Pending')->first()->file_status_id;

        // $formImage = $request->file('form_image');
        $formFile = $request->file('form_file');

        if ($request->hasFile('form_file')) {
            $formFileName = "{$area->area_name}-{$category}-form-file.{$validated->file('form_file')->getClientOriginalExtension()}";
            $formFilePath = "{$program}/{$area->area_name}/area-forms/files";
            $validated->file('form_file')->storeAs($formFilePath, $formFileName, 'public');
            $formFilePath = "{$program}/{$area->area_name}/area-forms/files/{$formFileName}";
        }

        /* if ($validated->hasFile('form_image')) {
            $formImageName = "{$area->area_name}-{$category}-form-image.{$validated->file('form_image')->getClientOriginalExtension()}";
            $formImagePath = "{$program}/{$area->area_name}/area-forms/images";
            $validated->file('form_image')->storeAs($formImagePath, $formImageName, 'public');
            $formImagePath = "{$program}/{$area->area_name}/area-forms/images/{$formImageName}";
        } */


        $areaForm = new AreaForms();
        $areaForm = [
            'area_id' => $validated['area_id'],
            'area_form_category_id' => $validated['area_form_category_id'],
            /* 'form_image_name' => $formImageName,
            'form_image_path' => $formImagePath, */
            'form_file_name' => $formFileName,
            'file_path' => $formFilePath,
            'file_status_id' => $pending,
        ];

        $areaForm->save();

        return redirect()->back()
            ->with('success', 'Area form created successfully.');
    }

    /**
     * Display the specified resource.
     * @return void
     */
    public function show(AreaForms $areaForms)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     * @return void
     */
    public function edit(AreaForms $areaForms)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     * @return void
     */
    public function update(Request $request, AreaForms $areaForms)
    {
        $validated = $request->validate([
            'form_id' => 'required|integer|exists:area_forms,area_form_id',
            'area_id' => 'required|integer|exists:areas,area_id',
            'area_form_category_id' => 'required|integer|exists:area_form_categories,area_form_category_id',
            'form_image' => 'nullable|file|mimes:jpg,jpeg,png',
            'form_file' => 'nullable|file|mimes:pdf',
        ]);

        $area = AreaForms::where('area_id', $validated['area_id'])->first();
        $program = $request->program_name;

        $category = AreaFormCategory::where('area_form_category_id', $validated['area_form_category_id'])
            ->first()->category_name;
        $pending = FileStatus::where('status_name', 'Pending')->first()->file_status_id;

        $formImage = $request->file('form_image');
        $formFile = $request->file('form_file');

        $formImageName = $category . '-form-image.' . $validated->file('form_image')->getClientOriginalExtension();
        $formImagePath = $program . '/' . $area->area_name . '/' . 'area_forms/images';
        $formFileName = $category . '-form-file.' . $validated->file('form_file')->getClientOriginalExtension();
        $formFilePath = $program . '/' . $area->area_name . '/' . 'area_forms/files';

        $areaForms = $areaForms->findOrFail($validated['form_id']);

        if($validated->hasFile('form_image')) {
            if ($areaForms->form_image_path) {
                Storage::disk('public')->delete($areaForms->form_image_path);
            }
            $areaForms->form_image_path = $validated->file('form_image')->storeAs(
                $formImagePath,
                $formImageName,
                'public'
            );
            $areaForms = update([
                'form_image_name' => $formImageName,
                'form_image_path' => $areaForms->form_image_path,
            ]);
        }

        if($validated->hasFile('form_file')) {
            if ($areaForms->file_path) {
                Storage::disk('public')->delete($areaForms->file_path);
            }
            $areaForms->file_path = $validated->file('form_file')->storeAs(
                $formFilePath,
                $formFileName,
                'public'
            );
            $areaForms = update([
                'file_name' => $formFileName,
                'file_path' => $areaForms->file_path,
            ]);
        }

        $areaForms->area_form_category_id == $validated['area_form_cateogry_id'] ?? $areaForms = update([ 'area_form_category_id' => $validated['area_form_category_id'] ]);

        return redirect()->back()
            ->with('success', 'Area form updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     * @return void
     */
    public function destroy(Request $request, AreaForms $areaForms)
    {
        $areaForms->find($request->form_id)->delete();

        return redirect()->back()
            ->with('success', 'Area form deleted successfully.');
    }
}

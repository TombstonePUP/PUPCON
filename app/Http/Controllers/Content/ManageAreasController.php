<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;
use App\Models\AreaFiles;
use App\Models\Areas;
use App\Models\Programs;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ManageAreasController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate(
            [
                'area_name' => ['required', 'string', 'max:255'],
                'area_number' => ['required', 'integer'],
                'area_description' => ['nullable', 'string'],
                'area_image' => ['nullable', 'file', 'mimes:jpg,jpeg,png', 'max:5120'],
            ],
            [
                'area_name.required' => 'The area name is required.',
                'area_name.string' => 'The area name must be a string.',
                'area_name.max' => 'The area name may not be greater than 255 characters.',
                'area_number.required' => 'The area number is required.',
                'area_number.integer' => 'The area number must be an integer.',
                'area_description.string' => 'The area description must be a string.',
                'area_image.file' => 'The area image must be a file.',
                'area_image.mimes' => 'The area image must be a file of type: jpg, jpeg, png.',
                'area_image.max' => 'The area image may not be greater than 5 MB.',
            ]
        );

        $program = Str::of($request->program_name)->replace('_', ' ')->title();
        $program = Programs::where('program_name','ILIKE', $program)
            ->with([
                'Levels' => function ($query) use ($request) {
                    $query->where('accreditation_level_id', $request->level_id);
                },
            ])
            ->firstOrFail();
        dd($program);

        $area = $program->Levels->first()->Areas()->create([
            'area_name' => $validated['area_name'],
            'area_number' => $validated['area_number'],
            'area_description' => $validated['area_description'] ?? null,
        ]);

        $disk = Storage::disk('public');

        if (isset($validated['area_image'])) {
            $areaImageName = Str::slug($validated['area_name'], '_') . '.' . $validated['area_image']->getClientOriginalExtension();
            $path = Str::slug($program->program_name, '_') . '/level_' . $program->Levels->first()->level . '/assets';
            $areaImagePath = $path . '/' . $areaImageName;
            if ($disk->exists($areaImagePath)) {
                $disk->delete($areaImagePath);
            }

            $validated['area_image']->storeAs($path, $areaImageName, 'public');
            $area->area_image_name = $areaImageName;
            $area->area_image_path = $areaImagePath;
        }
        $area->save();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Area Created')
            ->with('message', 'Area "' . $area->area_name . '" has been created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate(
            [
                'area_id' => ['required', 'integer', 'exists:areas,area_id'],
                'area_name' => ['required', 'string', 'max:255'],
                'area_number' => ['required', 'integer'],
                'area_description' => ['nullable', 'string'],
                'area_image' => ['nullable', 'file', 'mimes:jpg,jpeg,png', 'max:5120'],
            ],
            [
                'area_id.required' => 'The area ID is required.',
                'area_id.integer' => 'The area ID must be an integer.',
                'area_id.exists' => 'The selected area ID is invalid.',
                'area_name.required' => 'The area name is required.',
                'area_name.string' => 'The area name must be a string.',
                'area_name.max' => 'The area name may not be greater than 255 characters.',
                'area_number.required' => 'The area number is required.',
                'area_number.integer' => 'The area number must be an integer.',
                'area_description.string' => 'The area description must be a string.',
                'area_image.file' => 'The area image must be a file.',
                'area_image.mimes' => 'The area image must be a file of type: jpg, jpeg, png.',
                'area_image.max' => 'The area image may not be greater than 5 MB.',
            ]
        );

        $program = Str::of($request->program_name)->replace('_', ' ')->title();
        $program = Programs::where('program_name', 'ILIKE', $program)
            ->with([
                'Levels' => function ($query) use ($request) {
                    $query->where('accreditation_level_id', $request->level_id);
                },
            ])
            ->firstOrFail();

        $area = $program->Levels->first()->Areas()->where('area_id', $validated['area_id'])->firstOrFail();

        $base_path = Str::slug($program->program_name, '_') . '/level_' . $program->Levels->first()->level;

        $old_folder = Str::slug($area->area_name, '_');
        $new_folder = Str::slug($validated['area_name'], '_');

        $old_path = $base_path . '/' . $old_folder;
        $new_path = $base_path . '/' . $new_folder;

        $disk = Storage::disk('public');

        AreaFiles::query()
            ->whereHas('ParameterOutlines.AreaParameter.Areas', fn($q) => $q->where('area_id', $area->area_id))
            ->cursor()
            ->each(function ($file) use ($old_folder, $new_folder, $disk) {
                $old_file_path = $file->file_path;
                $new_file_path = Str::replace($old_folder, $new_folder, $old_file_path);
                if ($disk->exists($old_file_path)) {
                    $disk->move($old_file_path, $new_file_path);
                }
                $file->update(['file_path' => $new_file_path]);
                $file->save();
            });

        foreach ($area->AreaForms as $form) {
            $old_form_path = $form->file_path;
            $new_form_path = Str::of($old_form_path)->replace($old_folder, $new_folder);
            if ($disk->exists($old_form_path)) {
                $disk->move($old_form_path, $new_form_path);
                $form->file_path = $new_form_path;
                $form->save();
            }
        }

        if ($area->area_name !== $validated['area_name']) {
            if ($disk->exists($area->area_image_path) && $area->area_image_name) {
                $newAreaImageName = Str::slug($validated['area_name'], '_') . '.' . Str::afterLast($area->area_image_name, '.');
                $newAreaImagePath = Str::of($area->area_image_path)->replace($area->area_image_name, $newAreaImageName);
                $disk->move($area->area_image_path, $newAreaImagePath);
                $area->area_image_name = $newAreaImageName;
                $area->area_image_path = $newAreaImagePath;
            }
        }

        $area->area_name = $validated['area_name'];
        $area->area_number = $validated['area_number'];
        $area->area_description = $validated['area_description'] ?? null;
        if (isset($validated['area_image'])) {
            $areaImageName = 'area_' . Str::slug($validated['area_name'], '_') . '.' . $validated['area_image']->getClientOriginalExtension();
            $path = Str::slug($program->program_name, '_') . '/level_' . $program->Levels->first()->level;
            $areaImagePath = $path . '/' . $areaImageName;
            if ($disk->exists($areaImagePath)) {
                $disk->delete($areaImagePath);
            }
            $validated['area_image']->storeAs($path, $areaImageName, 'public');
            $area->area_image_name = $areaImageName;
            $area->area_image_path = $areaImagePath;
        } else {
            if ($disk->exists($area->area_image_path)) {
                $disk->delete($area->area_image_path);
            }
            $area->area_image_name = null;
            $area->area_image_path = null;
        }
        $area->save();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Area Updated')
            ->with('message', 'Area "' . $area->area_name . '" has been updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Areas $areas)
    {
        $area = $areas->find(request()->area_id);

        if ($area) {
            AreaFiles::query()
                ->whereHas('ParameterOutlines.AreaParameter.Areas', fn($q) => $q->where('area_id', $area->area_id))
                ->cursor()
                ->each(function ($file) {
                    Storage::disk('public')->delete($file->file_path);
                    $file->delete();
                });
            $areaName = $area->area_name;
            $area->delete();
        } else {
            return redirect()->back()
                ->with('type', 'error')
                ->with('title', 'Area Not Found')
                ->with('message', 'The specified area could not be found.');
        }

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Area Deleted')
            ->with('message', 'Area "' . $areaName . '" has been deleted successfully.');
    }

}

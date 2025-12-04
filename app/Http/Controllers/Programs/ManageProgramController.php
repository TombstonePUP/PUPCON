<?php

namespace App\Http\Controllers\Programs;

use App\Http\Controllers\Controller;
use App\Models\AreaForms;
use App\Models\Areas;
use App\Models\AreaFiles;
use App\Models\ProgramGallery;
use App\Models\Programs;
use App\Traits\ProgramLinkFormats;
use App\Traits\AreaNumeralFormat;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ManageProgramController extends Controller
{
    use ProgramLinkFormats, AreaNumeralFormat;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $programs = Programs::with([
            'latestLevel.Areas',
        ])
            ->orderBy('is_active', 'desc')
            ->orderBy('program_name', 'asc')
            ->get();

        $programs = $programs->map(function ($program) {
            $this->formatPrograms($program);
            return $program;
        });

        return inertia('manage-programs', [
            'programs' => $programs,
        ]);
    }

    public function show(string $program_id, string $level_id)
    {
        // $program = Str::of($program_name)->replace('_', ' ')->title();
        $program = Programs::findOrFail($program_id)->load([
            'Levels.Areas' => function ($query) use ($level_id) {
                $query->where('accreditation_level_id', $level_id)
                    ->orderByRaw('area_number::integer asc');
            },
            'Objectives',
            'Gallery',
        ]);

        //
        /* $program = Programs::where('program_name', 'ILIKE', $program)
            ->with([
                'Levels.Areas' => function ($query) use ($level_id) {
                    $query->where('accreditation_level_id', $level_id)
                        ->orderByRaw('area_number::integer asc');
                },
                'Objectives',
                'Gallery',
            ])->firstOrFail(); */

        $program->program_image_path = $program->program_image_path ? Storage::url($program->program_image_path) : null;
        $program->Gallery->each(function ($gallery) {
            $gallery->image_path = Storage::url($gallery->image_path);
            return $gallery;
        });

        $program->Levels->each(function ($level) use ($level_id) {
            if ($level->accreditation_level_id != $level_id) {
                $level->unsetRelation('Areas');
            }
            return $level;
        });

        $program->Levels->each(function ($level) {
            if ($level->relationLoaded('Areas')) {
                $level->Areas->each(function ($area) {
                    $area->area_numeral = $this->toRoman($area->area_number);
                    $area->area_image_path = $area->area_image_path ? Storage::url($area->area_image_path) : null;
                    return $area;
                });
            }
        });

        $program->program_link = Str::slug($program->program_name, '_');

        return inertia('document/program', [
            'program' => $program,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate(
            [
                'program_name' => ['required', 'string', 'max:255'],
                'degree_type' => ['required', 'string', 'max:100'],
            ],
            [
                'program_name.required' => 'The program name field is required.',
                'degree_type.required' => 'The degree type field is required.',
            ]
        );

        // Check if program with same name and degree type already exists
        $existingProgram = Programs::where('program_name', 'ILIKE', $validated['program_name'])
            ->where('degree_type', $validated['degree_type'])
            ->first();

        if ($existingProgram) {
            return back()->withErrors([
                'program_name' => 'A program with this name and degree type already exists.'
            ]);
        }

        $program = Programs::create([
            'program_name' => $validated['program_name'],
            'degree_type' => $validated['degree_type'],
        ]);

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Program Created')
            ->with('message', 'Program "' . $program->program_name . '" has been created successfully.');
    }

    public function update(Request $request)
    {
        $program = Programs::findOrFail($request->program_id);

        $validated = $request->validate(
            [
                'program_name' => ['required', 'string', 'max:255'],
                'degree_type' => ['required', 'string', 'max:100'],
            ],
            [
                'program_name.required' => 'The program name field is required.',
                'degree_type.required' => 'The degree type field is required.',
            ]
        );

        // Check for duplicates
        $existingProgram = Programs::where('program_name', 'ILIKE', $validated['program_name'])
            ->where('degree_type', $validated['degree_type'])
            ->where('program_id', '!=', $program->program_id)
            ->first();

        if ($existingProgram) {
            return back()->withErrors([
                'program_name' => 'A program with this name and degree type already exists.'
            ]);
        }

        $disk = Storage::disk('public');

        // Old & new base paths
        $old_base_path = 'documents/' . Str::slug($program->degree_type, '_') . '_' . Str::slug($program->program_name, '_');
        $new_base_path = 'documents/' . Str::slug($validated['degree_type'], '_') . '_' . Str::slug($validated['program_name'], '_');

        // Ensure new folder exists
        if (!$disk->exists($new_base_path)) {
            $disk->makeDirectory($new_base_path);
        }

        DB::transaction(function () use ($program, $validated, $disk, $old_base_path, $new_base_path) {

            //Copy Program image
            if ($program->program_image_path && $disk->exists($program->program_image_path)) {
                $extension = pathinfo($program->program_image_name, PATHINFO_EXTENSION);
                $new_image_name = Str::slug($validated['program_name'], '_') . '.' . $extension;
                $new_program_image_path = $new_base_path . '/assets/' . $new_image_name;

                if (!$disk->exists(dirname($new_program_image_path))) {
                    $disk->makeDirectory(dirname($new_program_image_path));
                }

                $disk->copy($program->program_image_path, $new_program_image_path);
                $program->program_image_name = $new_image_name;
                $program->program_image_path = $new_program_image_path;
                $program->save();
            }

            //Copy Program Gallery
            ProgramGallery::where('program_id', $program->program_id)->get()
                ->each(function ($gallery) use ($disk, $new_base_path) {
                    if ($disk->exists($gallery->image_path)) {
                        $new_image_path = $new_base_path . '/assets/gallery/' . basename($gallery->image_path);

                        if (!$disk->exists(dirname($new_image_path))) {
                            $disk->makeDirectory(dirname($new_image_path));
                        }

                        $disk->copy($gallery->image_path, $new_image_path);
                        $gallery->image_path = $new_image_path;
                        $gallery->save();
                    }
                });

            //Copy Area images
            Areas::whereHas('Levels', fn($q) => $q->where('program_id', $program->program_id))
                ->get()
                ->each(function ($area) use ($disk, $old_base_path, $new_base_path, $validated) {
                    if ($area->area_image_path && $disk->exists($area->area_image_path)) {
                        $file_name = basename($area->area_image_path);
                        $ext = pathinfo($file_name, PATHINFO_EXTENSION);
                        $new_area_image_name = Str::slug($validated['program_name'], '_') . '_area_' . $area->area_number . '.' . $ext;
                        $new_area_image_path = str_replace($old_base_path, $new_base_path, $area->area_image_path);

                        if (!$disk->exists(dirname($new_area_image_path))) {
                            $disk->makeDirectory(dirname($new_area_image_path));
                        }

                        $disk->copy($area->area_image_path, $new_area_image_path);

                        $area->area_image_name = $new_area_image_name;
                        $area->area_image_path = $new_area_image_path;
                        $area->save();
                    }
                });

            //Copy AreaFiles
            AreaFiles::whereHas('ParameterOutlines.AreaParameter.Areas.Levels', fn($q) => $q->where('program_id', $program->program_id))
                ->get()
                ->each(function ($file) use ($disk, $old_base_path, $new_base_path) {
                    if ($disk->exists($file->file_path)) {
                        $new_file_path = str_replace($old_base_path, $new_base_path, $file->file_path);
                        if (!$disk->exists(dirname($new_file_path))) {
                            $disk->makeDirectory(dirname($new_file_path));
                        }
                        $disk->copy($file->file_path, $new_file_path);
                        $file->file_path = $new_file_path;
                        $file->save();
                    }
                });

            //Copy AreaForms
            AreaForms::whereHas('Area.Levels', fn($q) => $q->where('program_id', $program->program_id))
                ->get()
                ->each(function ($form) use ($disk, $old_base_path, $new_base_path) {
                    if ($disk->exists($form->file_path)) {
                        $new_form_path = str_replace($old_base_path, $new_base_path, $form->file_path);
                        if (!$disk->exists(dirname($new_form_path))) {
                            $disk->makeDirectory(dirname($new_form_path));
                        }
                        $disk->copy($form->file_path, $new_form_path);
                        $form->file_path = $new_form_path;
                        $form->save();
                    }
                });

            if ($disk->exists($old_base_path)) {
                $disk->deleteDirectory($old_base_path);
            }

            //Finally, update the program
            $program->update([
                'program_name' => $validated['program_name'],
                'degree_type' => $validated['degree_type'],
            ]);
        });

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Program Updated')
            ->with('message', 'Program "' . $program->program_name . '" has been updated successfully.');
    }

    public function destroy(Request $request)
    {
        $program = Programs::findOrFail($request->program_id);
        $programName = $program->program_name;

        $validated = $request->validate(
            [
                'program_id' => ['required', 'exists:programs,program_id'],
                'confirmation_text' => ['required', "in:$programName"],
            ],
            [
                'confirmation_text.in' => 'The confirmation text does not match the program name.',
            ]
        );

        $program = Programs::findOrFail($validated['program_id']);
        $programName = $program->program_name;
        $program->update(['is_active' => false]);

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Program Archived')
            ->with('message', $programName . ' has been archived successfully.');
    }
}

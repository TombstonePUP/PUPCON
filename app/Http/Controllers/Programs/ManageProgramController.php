<?php

namespace App\Http\Controllers\Programs;

use App\Http\Controllers\Controller;
use App\Models\Areas;
use App\Models\Programs;
use App\Traits\ProgramLinkFormats;
use App\Traits\AreaNumeralFormat;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ManageProgramController extends Controller
{
    use ProgramLinkFormats, AreaNumeralFormat;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        if ($user->Roles->role_name === 'Admin' || $user->Roles->role_name === 'Coordinator') {
            $programs = Programs::with('latestLevel')
                ->orderBy('program_name', 'asc')->get();
        } else {
            $programs = Programs::with('latestLevel')
                ->orderBy('program_name', 'asc')->get();
        }

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
                    $area->area_image_path = $area->area_image_path ? asset('storage/' . $area->area_image_path) : null;
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

        $program->update([
            'program_name' => $validated['program_name'],
            'degree_type' => $validated['degree_type'],
        ]);

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Program Updated')
            ->with('message', 'Program "' . $program->program_name . '" has been updated successfully.');
    }

    public function destroy(Request $request)
    {
        $program = Programs::findOrFail($request->program_id);
        $programName = $program->program_name;
        $program->update(['is_active' => false]);

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Program Archived')
            ->with('message', $programName . ' has been archived successfully.');
    }
}

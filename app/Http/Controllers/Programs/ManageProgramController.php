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
                ->where('is_active', true)
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

    public function show(string $program_name, string $level_id)
    {
        $program = Str::of($program_name)->replace('_', ' ')->title();
        $program = Programs::where('program_name', $program)
            ->with([
                'Levels.Areas',
            ])->firstOrFail();

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
                });
            }
        });

        $program->program_link = $program_name;

        return inertia('document/program', [
            'program' => $program,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'program_name' => ['required', 'string', 'max:255', 'unique:programs,program_name'],
            'degree_type' => ['required', 'string', 'max:100'],
        ]);

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

        $validated = $request->validate([
            'program_name' => ['required', 'string', 'max:255'],
            'degree_type' => ['required', 'string', 'max:100'],
        ]);

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
            ->with('title', 'Program Deleted')
            ->with('message', $programName . ' has been deleted successfully.');
    }
}

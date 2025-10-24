<?php

namespace App\Http\Controllers\Programs;

use App\Http\Controllers\Controller;
use App\Models\Areas;
use App\Models\Programs;
use App\Traits\ProgramLinkFormats;
use App\Traits\AreaNumeralFormat;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class ManageProgramController extends Controller
{
    use ProgramLinkFormats, AreaNumeralFormat;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $programs = Programs::select('*')->with([
            'Levels' => function ($query) {
                $query->where('is_active', true)->with('Areas');
            },
        ])->get();
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
}

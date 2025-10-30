<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Programs;
use App\Traits\ProgramLinkFormats;
use App\Traits\AreaNumeralFormat;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProgramsController extends Controller
{
    use ProgramLinkFormats, AreaNumeralFormat;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $programs = Programs::select('program_id', 'degree_type', 'program_name', 'program_description', 'program_image_name', 'program_image_path')
            ->with('Levels')
            ->where('under_survey', true)
            ->get();

        $programs = $programs->map(function ($program) {
            $this->formatPrograms($program);
            return $program;
        });

        return inertia('programs', [
            'programs' => $programs,
        ]);
    }

    public function ratings()
    {
        $programs = Programs::select('program_id', 'degree_type', 'program_name', 'program_description', 'accreditation_level', 'program_image_name', 'program_image_path')
            ->where('under_survey', true)
            ->get();

        $programs = $programs->map(function ($program) {
            $this->formatPrograms($program);
            return $program;
        });

        return inertia('document/ratings', [
            'programs' => $programs,
        ]);
    }
    public function show(string $program_name): Response
    {
        $program = Str::of($program_name)->replace('_', ' ')->title();

        $program = Programs::where('program_name', $program)
            ->with([
                'Levels' => function ($query) {
                    $query->where('is_active', true);
                },
                 'Levels.Areas',
                 'Faculties',
                 'Objectives',
                 'ProgramGallery'
            ])
            ->firstOrFail();

        $program->program_link = $program_name;

        // Format areas (Roman numeral conversion)
        $program->Levels->Areas = $program->Levels->flatMap(function ($level) {
            $level->Areas = $level->Areas->map(function ($area) {
                $area->area_numeral = $this->toRoman($area->area_number);
                return $area;
            });
            return $level->Areas;
        });

        return inertia('programview', [
            'program' => $program,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Programs;
use App\Traits\ProgramLinkFormats;
use App\Traits\AreaNumeralFormat;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class ProgramsController extends Controller
{
    use ProgramLinkFormats, AreaNumeralFormat;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $programs = Programs::select('program_id', 'degree_type', 'program_name', 'program_description', 'program_image_name', 'program_image_path')
            ->with('ActiveLevels')
            ->where('under_survey', true)
            ->get();

        $programs = $programs->map(function ($program) {
            $this->formatPrograms($program);
            $program->program_image_path = Storage::url($program->program_image_path);
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
            ->where('is_active', true)
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

        $program = Programs::where('program_name', 'ILIKE', $program)
            ->with([
                'Levels' => function ($query) {
                    $query->with('Areas')->where('is_active', true)->orderBy('survey_date', 'desc');
                },
                'FacultyStaff',
                'Objectives',
                'Gallery',
            ])
            ->firstOrFail();


        $program->program_link = $program_name;
        $program->program_image_path = $program->program_image_path ? Storage::url($program->program_image_path) : null;

        $program->FacultyStaff = $program->FacultyStaff->map(function ($faculty) {
            $faculty->image_path = $faculty->image_path ? Storage::url($faculty->image_path) : null;
            return $faculty;
        });

        $program->Gallery = $program->Gallery->map(function ($gallery) {
            $gallery->image_path = Storage::url($gallery->image_path);
            return $gallery;
        });

        // Format areas (Roman numeral conversion)
        $program->Levels->Areas = $program->Levels->flatMap(function ($level) {
            $level->Areas = $level->Areas->map(function ($area) {
                $area->area_numeral = $this->toRoman($area->area_number);
                $area->area_image_path = $area->area_image_path ? Storage::url($area->area_image_path) : null;
                return $area;
            });
            return $level->Areas;
        });

        return inertia('programview', [
            'program' => $program,
        ]);
    }
}

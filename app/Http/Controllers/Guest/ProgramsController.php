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
            ->where('is_active', true)
            ->where('under_survey', true)
            ->get();

        $programs = $programs->map(function ($program) {
            $this->formatPrograms($program);
            $program->program_image_path = $program->program_image_path 
                ? (str_starts_with($program->program_image_path, '/') ? $program->program_image_path : Storage::url($program->program_image_path)) 
                : null;
            return $program;
        });

        return inertia('guest/programs', [
            'programs' => $programs,
        ]);
    }

    public function show(string $program_id): Response
    {
        $program = Programs::findOrFail($program_id)->load([
            'Levels' => function ($query) {
                $query->with([
                    'Areas' => function ($q) {
                        $q->where('archive', false)->orderBy('area_number', 'asc');
                    },
                ])->where('is_active', true)->where('remarks', 'Ongoing Survey')->orderBy('survey_date', 'desc');
            },
            'FacultyStaff',
            'Objectives',
            'Gallery',
        ]);

        $program->program_image_path = $program->program_image_path 
            ? (str_starts_with($program->program_image_path, '/') ? $program->program_image_path : Storage::url($program->program_image_path)) 
            : null;

        $program->FacultyStaff = $program->FacultyStaff->map(function ($faculty) {
            $faculty->image_path = $faculty->image_path 
                ? (str_starts_with($faculty->image_path, '/') ? $faculty->image_path : Storage::url($faculty->image_path)) 
                : null;
            return $faculty;
        });

        $program->Gallery = $program->Gallery->map(function ($gallery) {
            $gallery->image_path = $gallery->image_path 
                ? (str_starts_with($gallery->image_path, '/') ? $gallery->image_path : Storage::url($gallery->image_path)) 
                : null;
            return $gallery;
        });

        // Format areas (Roman numeral conversion)
        $program->Levels->Areas = $program->Levels->flatMap(function ($level) {
            $level->Areas = $level->Areas->map(function ($area) {
                $area->area_numeral = $this->toRoman($area->area_number);
                $area->area_image_path = $area->area_image_path 
                    ? (str_starts_with($area->area_image_path, '/') ? $area->area_image_path : Storage::url($area->area_image_path)) 
                    : null;
                return $area;
            });
            return $level->Areas;
        });

        return inertia('guest/programview', [
            'program' => $program,
        ]);
    }
}

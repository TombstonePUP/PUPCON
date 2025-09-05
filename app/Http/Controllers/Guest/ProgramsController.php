<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Programs;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProgramsController extends Controller
{

    public static function numericalToRoman(int $number): string
    {
        $numerals = [
            1 => 'I',
            2 => 'II',
            3 => 'III',
            4 => 'IV',
            5 => 'V',
            6 => 'VI',
            7 => 'VII',
            8 => 'VIII',
            9 => 'IX',
            10 => 'X',
            11 => 'XI',
            12 => 'XII',
            13 => 'XIII',
            14 => 'XIV',
            15 => 'XV',
        ];

        if ($number > 15) {
            return ' ';
        } else {
            return $numerals[$number];
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $programs = Programs::select('program_id','degree_type', 'program_name', 'program_description', 'accreditation_level', 'program_image_name', 'program_image_path')
            ->where('under_survey', true)
            ->get();

        $programs = $programs->map(function ($program) {
            $program->program_link = Str::of($program->program_name)->snake();
            return $program;
        });
        return inertia('programs', [
            'programs' => $programs,
        ]);
    }

    public function show(string $program_name): Response
    {
        $program_name = Str::of($program_name)->replace('_', ' ')->title();
        $program = Programs::select('*')
            ->where('program_name', $program_name)
            ->with('Areas')
            ->firstOrFail();

        $program->Areas = $program->Areas->map(function ($area) {
            $area->area_numeral = $this->numericalToRoman($area->area_number);
            return $area;
        });

        return inertia('programview', [
            'program' => $program,
        ]);
    }
}

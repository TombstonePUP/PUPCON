<?php

namespace App\Http\Controllers\Programs;

use App\Http\Controllers\Controller;
use App\Models\Areas;
use App\Models\Programs;
use App\Traits\ProgramLinkFormats;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class ManageProgramController extends Controller
{
    use ProgramLinkFormats;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, string $program_name)
    {
        $program = Str::of($program_name)->replace('_', ' ')->title();
        $program = Programs::where('program_name', $program)->with('Areas')->firstOrFail();
        $program->program_link = $program_name;
        return inertia('document/program', [
            'program' => $program,
            // 'areas' => $areas,
        ]);
    }

    public function show()
    {
        $programs = Programs::select('*')->with('Areas')->get();
        $programs = $programs->map(function ($program) {
            $this->formatPrograms($program);
            return $program;
        });

        return inertia('manage-programs', [
            'programs' => $programs,
        ]);
    }

}

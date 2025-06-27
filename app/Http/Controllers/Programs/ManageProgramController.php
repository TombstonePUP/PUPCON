<?php

namespace App\Http\Controllers\Programs;

use App\Http\Controllers\Controller;
use App\Models\Areas;
use App\Models\Programs;
use Illuminate\Http\Request;

class ManageProgramController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, string $program_name)
    {
        $program = Programs::where('program_name', $program_name)->with('Areas')->firstOrFail();
        return inertia('document/program', [
            'program' => $program,
            // 'areas' => $areas,
        ]);
    }

    public function show()
    {
        $programs = Programs::select('*')->with('Areas')->get();
        return inertia('manage-programs', [
            'programs' => $programs,
        ]);
    }

}

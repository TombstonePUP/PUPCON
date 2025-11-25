<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\FacultyStaff;
use Inertia\Inertia;
use App\Models\ContentPages;

class FacultyController extends Controller
{
    public function index()
    {
        $faculties = FacultyStaff::select(
            'faculty_staff_id',
            'first_name',
            'middle_name',
            'last_name',
            'personnel_type',
            'status',
            'program_id',
            'program_coordinator',
            'image_name',
            'image_path'
        )->get();

        $page = ContentPages::where('page', 'Faculty & Staff')->first();

        return Inertia::render('about/faculty', [
            'faculties' => $faculties,
            'page' => $page,
        ]);
    }
}

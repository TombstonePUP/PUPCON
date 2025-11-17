<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\FacultyStaff;
use Inertia\Inertia;

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

        return Inertia::render('about/faculty', [
            'faculties' => $faculties,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Faculty;     // <-- Make sure you already created this model
use Inertia\Inertia;

class FacultyController extends Controller
{
    public function index()
    {
        $faculties = Faculty::select(
            'faculty_id',
            'first_name',
            'middle_name',
            'last_name',
            'suffix',
            'faculty_status',
            'program_id',
            'program_coordinator',
            'faculty_image_name',
            'faculty_image_path'
        )->get();

        return Inertia::render('about/faculty', [
            'faculties' => $faculties,
        ]);
    }
}

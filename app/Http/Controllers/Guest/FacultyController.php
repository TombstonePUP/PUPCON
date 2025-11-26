<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\FacultyStaff;
use Inertia\Inertia;
use App\Models\ContentPages;
use Illuminate\Support\Facades\Storage;

class FacultyController extends Controller
{
    public function index()
    {
        $faculties = FacultyStaff::all();
        $faculties = $faculties->map(function ($faculty) {
            $faculty->image_path = $faculty->image_path ? Storage::url($faculty->image_path) : null;
            return $faculty;
        });
        $page = ContentPages::where('page', 'Faculty & Staff')->first();

        return Inertia::render('about/faculty', [
            'faculties' => $faculties,
            'page' => $page,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\ContentPages;
use App\Models\FacultyStaff;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class FacultyController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function index(): Response
    {
        $faculties = FacultyStaff::all();
        $faculties = $faculties->map(function ($faculty) {
            $faculty->image_path = $faculty->image_path ? $faculty->image_path = Storage::url($faculty->image_path) : null;

            return $faculty;
        });
        $page = ContentPages::where('page', 'Faculty & Staff')->first();

        return Inertia::render('guest/about/faculty', [
            'faculties' => $faculties,
            'page' => $page,
        ]);
    }
}

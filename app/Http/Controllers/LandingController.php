<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class LandingController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $folder = public_path('images/landing');
        $files = File::files($folder);

        $images = array_map(fn($file) => asset('images/landing/' . $file->getFilename()), $files);

        return inertia('guest/welcome', [
            'carouselImages' => $images,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\File;
use Inertia\Response;

class LandingController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        $folder = public_path('images/landing');
        $files = File::files($folder);

        $images = array_map(fn ($file) => asset('images/landing/'.$file->getFilename()), $files);

        return inertia('guest/welcome', [
            'carouselImages' => $images,
        ]);
    }
}

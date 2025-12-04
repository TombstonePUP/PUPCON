<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\CampusGallery;
use Illuminate\Http\Request;
use App\Models\ContentPages;
use Illuminate\Support\Facades\Storage;

class WelcomeViewController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $page = ContentPages::where('page', 'Welcome')->first();
        if ($page) {
            $page->director_image_path = $page->director_image_path ? Storage::url($page->director_image_path) : null;
        }

        $carousel_images = CampusGallery::where('carousel', true)->get();
        $carousel_images = $carousel_images->map(function ($item) {
            $item->image_path = $item->image_path ? Storage::url($item->image_path) : null;
            return $item;
        });

        return inertia('welcome', [
            'page' => $page,
            'carousel_images' => $carousel_images,
        ]);
    }
}

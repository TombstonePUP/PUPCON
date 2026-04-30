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
            $path = $page->director_image_path;
            if ($path && !str_starts_with($path, 'http') && !str_starts_with($path, '/storage') && !str_starts_with($path, '/images')) {
                $page->director_image_path = Storage::url($path);
            }
        }

        $carousel_images = CampusGallery::where('carousel', true)->get();
        $carousel_images = $carousel_images->map(function ($item) {
            $path = $item->image_path;
            if ($path && !str_starts_with($path, 'http') && !str_starts_with($path, '/storage') && !str_starts_with($path, '/images')) {
                $item->image_path = Storage::url($path);
            }
            return $item;
        });

        return inertia('guest/welcome', [
            'page' => $page,
            'carousel_images' => $carousel_images,
        ]);
    }
}

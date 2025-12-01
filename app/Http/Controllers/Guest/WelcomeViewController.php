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
            if ($page->image_path && Storage::exists($page->image_path)) {
                $page->image_path = Storage::url($page->image_path);
            } else {
                $page->image_path = null;
            }
        }

        $carousel_images = CampusGallery::where('carousel', true)->get();
        $carousel_images = $carousel_images->map(function ($item) {
            if ($item->image_path && Storage::exists($item->image_path)) {
                $item->image_path = Storage::url($item->image_path);
            } else {
                $item->image_path = null;
            }
            return $item;
        });

        return inertia('welcome', [
            'page' => $page,
            'carousel_images' => $carousel_images,
        ]);
    }
}

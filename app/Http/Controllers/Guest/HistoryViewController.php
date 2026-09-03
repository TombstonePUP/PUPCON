<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\CampusDirectors;
use App\Models\CampusGallery;
use App\Models\ContentPages;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class HistoryViewController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {
        $pages = ContentPages::where('page', 'History')->first();

        if ($pages) {
            $pages->image_path = $pages->image_path ? Storage::url($pages->image_path) : null;
        }

        $directors = CampusDirectors::all();
        $directors = $directors->map(function ($director) {
            $director->profile_image_path = $director->profile_image_path ? Storage::url($director->profile_image_path) : null;

            return $director;
        });

        $gallery = CampusGallery::where('carousel', false)->get();
        $gallery = $gallery->map(function ($item) {
            $item->image_path = $item->image_path ? Storage::url($item->image_path) : null;

            return $item;
        });

        return inertia('guest/about/history', [
            'page' => $pages,
            'directors' => $directors,
            'gallery' => $gallery,
        ]);
    }
}

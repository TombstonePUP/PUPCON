<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContentPages;
use App\Models\CampusDirectors;
use App\Models\CampusGallery;
use Illuminate\Support\Facades\Storage;

class HistoryViewController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $pages = ContentPages::where('page', 'History')->first();

        if ($pages) {
            if ($pages->image_path && Storage::exists($pages->image_path)) {
                $pages->image_path = Storage::url($pages->image_path);
            } else {
                $pages->image_path = null;
            }
        }

        $directors = CampusDirectors::all()->map(function ($director) {
            $director->progile_image_path =
                ($director->progile_image_path && Storage::exists($director->progile_image_path))
                ? Storage::url($director->progile_image_path)
                : null;

            return $director;
        });

        $gallery = CampusGallery::all()->map(function ($item) {
            $item->image_path =
                ($item->image_path && Storage::exists($item->image_path))
                ? Storage::url($item->image_path)
                : null;

            return $item;
        });

        return inertia('about/history', [
            'page' => $pages,
            'directors' => $directors,
            'gallery' => $gallery,
        ]);
    }
}

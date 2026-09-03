<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\ContentPages;
use App\Models\Facilities;
use Illuminate\Support\Facades\Storage;

class FacilitiesViewController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke()
    {
        $page = ContentPages::where('page', 'Facilities')->first();
        $facilities = Facilities::all();
        $facilities = $facilities->map(function ($facility) {
            $facility->image_path = $facility->image_path ? $facility->image_path = Storage::url($facility->image_path) : null;

            return $facility;
        });

        return inertia('guest/about/facilities', [
            'page' => $page,
            'facilities' => $facilities,
        ]);
    }
}

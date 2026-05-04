<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\ContentPages;
use App\Models\Facilities;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class FacilitiesViewController extends Controller
{
    /**
     * Handle the incoming request.
     * @return Response
     */
    public function __invoke(Request $request)
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

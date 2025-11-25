<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\ContentPages;
use App\Models\Facilities;
use App\Models\OrganizationTypes;
use App\Models\Programs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AboutViewController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {

        $page = ContentPages::where('page', 'About')->first();
        $page->image_path = Storage::url( $page->image_path);
        $programs = Programs::count();
        $facilities = Facilities::count();

        $org_types = OrganizationTypes::with('Organizations')->get();
        return inertia('about/about', [
            'page' => $page,
            'programs' => $programs,
            'facilities' => $facilities,
            'org_types' => $org_types,
        ]);
    }
}

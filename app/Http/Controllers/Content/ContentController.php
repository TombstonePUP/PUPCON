<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;
use App\Models\ContentPages;
use App\Models\Facilities;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Organizations;
use App\Models\OrganizationTypes;
use Illuminate\Support\Facades\Storage;

class ContentController extends Controller
{
    /**
     * Handle the incoming request.
     * This will load all data for the "About" page.
     */
    public function __invoke(Request $request)
    {
        $orgTypes = OrganizationTypes::orderBy('type_name')->get();
        $organizations = Organizations::with('OrganizationTypes')->orderBy('organization_name')->get();

        $aboutData = [
            'welcome_title' => 'Welcome (from DB)',
            'welcome_subtitle' => 'This is the subtitle from the database.',
            'address' => '123 Main St, Manila',
            'phone_number' => '+63 2 8123 4567',
        ];

        $facilities = Facilities::all();
        $facilities = $facilities->map(function ($facility) {
            $facility->image_path = Storage::url($facility->image_path);
            return $facility;
        });
        $facility_page = ContentPages::where('title', 'Facilities')->first();

        return Inertia::render('content-management/main-content', [
            'orgTypes' => $orgTypes,
            'organizations' => $organizations,
            'aboutData' => $aboutData,
            'facilities' => $facilities,
            'facility_page' => $facility_page,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;
use App\Models\ContentPages;
use App\Models\Facilities;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Organizations;
use App\Models\OrganizationTypes;
use App\Models\UniversityAdministration;
use Illuminate\Support\Facades\Storage;

class ContentController extends Controller
{
    /**
     * Handle the incoming request.
     * This will load all data for the "About" page.
     */
    public function __invoke(Request $request)
    {
        $orgTypes = OrganizationTypes::orderBy('type_name')
            ->with(['organizations' => function ($query) {
                $query->orderBy('organization_name');
            }])
            ->get();

        $pages = ContentPages::all();
        $pages = $pages->map(function ($page) {
            $page->image_path = Storage::url($page->image_path);
            return $page;
        });

        $officials = UniversityAdministration::all();
        $officials = $officials->map(function ($official) {
            $official->profile_picture_path = Storage::url($official->profile_picture_path);
            return $official;
        });

        $facilities = Facilities::all();
        $facilities = $facilities->map(function ($facility) {
            $facility->image_path = Storage::url($facility->image_path);
            return $facility;
        });

        return Inertia::render('content-management/main-content', [
            'pages' => $pages,
            'org_types' => $orgTypes,
            'officials' => $officials,
            'facilities' => $facilities,
        ]);
    }
}

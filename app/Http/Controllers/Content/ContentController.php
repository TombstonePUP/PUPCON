<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;
use App\Models\CampusDirectors;
use App\Models\CampusGallery;
use App\Models\CampusGoals;
use App\Models\ContentPages;
use App\Models\Facilities;
use App\Models\FacultyStaff;
use App\Models\LocalTaskForce;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Organizations;
use App\Models\OrganizationTypes;
use App\Models\Pillars;
use App\Models\UniversityAdministration;
use App\Models\Vmgo;
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
            $page->image_path = $page->image_path ? Storage::url($page->image_path) : null;
            $page->director_image_path = $page->director_image_path ? Storage::url($page->director_image_path) : null;
            $page->certificate_of_authenticity = $page->certificate_of_authenticity ? Storage::url($page->certificate_of_authenticity) : null;
            return $page;
        });

        $welcome_carousel = CampusGallery::where('carousel', true)->get();
        $welcome_carousel = $welcome_carousel->map(function ($image) {
            $image->image_path = $image->image_path ? Storage::url($image->image_path) : null;
            return $image;
        });

        $officials = UniversityAdministration::all();
        $officials = $officials->map(function ($official) {
            $official->profile_picture_path = $official->profile_picture_path ? Storage::url($official->profile_picture_path) : null;
            return $official;
        });

        $faculties = FacultyStaff::all();
        $faculties = $faculties->map(function ($faculty) {
            $faculty->image_path = $faculty->image_path ? Storage::url($faculty->image_path) : null;
            return $faculty;
        });

        $facilities = Facilities::all();
        $facilities = $facilities->map(function ($facility) {
            $facility->image_path = $facility->image_path ? Storage::url($facility->image_path) : null;
            return $facility;
        });

        $directors = CampusDirectors::all();
        $directors = $directors->map(function ($director) {
            $director->profile_image_path = $director->profile_image_path ? Storage::url($director->profile_image_path) : null;
            return $director;
        });

        $gallery = CampusGallery::where('carousel', false)->get();
        $gallery = $gallery->map(function ($image) {
            $image->image_path = $image->image_path ? Storage::url($image->image_path) : null;
            return $image;
        });

        $history = [
            'directors' => $directors,
            'gallery' => $gallery,
        ];

        $local_task_force = LocalTaskForce::with('Members')->get();
        $local_task_force = $local_task_force->map(function ($ltf) {
            $ltf->profile_image_path = Storage::url($ltf->profile_image_path);
            return $ltf;
        });

        $campus_goals = CampusGoals::all();
        $pillars = Pillars::with('PillarItems')->get();
        $vmgo = Vmgo::first();

        $vmgo_data = [
            'campus_goals' => $campus_goals,
            'pillars' => $pillars,
            'vmgo' => $vmgo,
        ];

        return Inertia::render('content-management/main-content', [
            'pages' => $pages,
            'welcome_gallery' => $welcome_carousel,
            'org_types' => $orgTypes,
            'officials' => $officials,
            'faculties' => $faculties,
            'facilities' => $facilities,
            'history' => $history,
            'local_task_force' => $local_task_force,
            'vmgo_data' => $vmgo_data,
        ]);
    }
}

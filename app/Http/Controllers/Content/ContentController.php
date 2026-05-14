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
use App\Models\OrganizationTypes;
use App\Models\Pillars;
use App\Models\UniversityAdministration;
use App\Models\Vmgo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ContentController extends Controller
{
    /**
     * Helper to format storage URLs.
     *
     * @return null|<missing>|string
     */
    private function formatStorageUrl($path)
    {
        if (! $path) {
            return null;
        }
        if (str_starts_with($path, 'http') || str_starts_with($path, '/storage') || str_starts_with($path, '/images')) {
            return $path;
        }

        return Storage::url($path);
    }

    /**
     * Handle the incoming request.
     * This will load all data for the "About" page.
     */
    public function __invoke(): Response
    {
        $orgTypes = OrganizationTypes::orderBy('type_name')
            ->with(['organizations' => function ($query) {
                $query->orderBy('organization_name');
            }])
            ->get();

        $pages = ContentPages::all();
        $pages = $pages->map(function ($page) {
            $page->image_path = $this->formatStorageUrl($page->image_path);
            $page->director_image_path = $this->formatStorageUrl($page->director_image_path);
            $page->certificate_of_authenticity = $this->formatStorageUrl($page->certificate_of_authenticity);

            return $page;
        });

        $welcome_carousel = CampusGallery::where('carousel', true)->get();
        $welcome_carousel = $welcome_carousel->map(function ($image) {
            $image->image_path = $this->formatStorageUrl($image->image_path);

            return $image;
        });

        $officials = UniversityAdministration::all();
        $officials = $officials->map(function ($official) {
            $official->profile_picture_path = $this->formatStorageUrl($official->profile_picture_path);

            return $official;
        });

        $faculties = FacultyStaff::all();
        $faculties = $faculties->map(function ($faculty) {
            $faculty->image_path = $this->formatStorageUrl($faculty->image_path);

            return $faculty;
        });

        $facilities = Facilities::all();
        $facilities = $facilities->map(function ($facility) {
            $facility->image_path = $this->formatStorageUrl($facility->image_path);

            return $facility;
        });

        $directors = CampusDirectors::all();
        $directors = $directors->map(function ($director) {
            $director->profile_image_path = $this->formatStorageUrl($director->profile_image_path);

            return $director;
        });

        $gallery = CampusGallery::where('carousel', false)->get();
        $gallery = $gallery->map(function ($image) {
            $image->image_path = $this->formatStorageUrl($image->image_path);

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

        return Inertia::render('admin/content-management/main-content', [
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

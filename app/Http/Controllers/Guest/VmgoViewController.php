<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\CampusGoals;
use App\Models\ContentPages;
use App\Models\Pillars;
use App\Models\Vmgo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VmgoViewController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $page = ContentPages::where('page', 'Vision, Mission & Goals')->first();
        $page->image_path = $page->image_path ? Storage::url($page->image_path) : null;

        $campus_goals = CampusGoals::all();
        $pillars = Pillars::with('PillarItems')->get();
        $vmgo = Vmgo::first();

        return inertia('about/vmgo', [
            'page' => $page,
            'campus_goals' => $campus_goals,
            'pillars' => $pillars,
            'vmgo' => $vmgo,
        ]);

    }
}

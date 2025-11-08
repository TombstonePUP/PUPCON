<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia; 
use App\Models\OrgType; 
use App\Models\Organization; 

class ContentController extends Controller
{
    /**
     * Handle the incoming request.
     * This will load all data for the "About" page.
     */
    public function __invoke(Request $request)
    {
        $orgTypes = OrgType::orderBy('name')->get();
        $organizations = Organization::orderBy('name')->get();
        
        $aboutData = [
            'welcome_title' => 'Welcome (from DB)',
            'welcome_subtitle' => 'This is the subtitle from the database.',
            'address' => '123 Main St, Manila',
            'phone_number' => '+63 2 8123 4567',
        ];

        return Inertia::render('AboutPageSection', [
            'orgTypes' => $orgTypes,
            'organizations' => $organizations,
            'aboutData' => $aboutData,
        ]);
    }
}
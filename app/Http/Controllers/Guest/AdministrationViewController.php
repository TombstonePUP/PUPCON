<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\UniversityAdministration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\ContentPages;

class AdministrationViewController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $officials = UniversityAdministration::all();
        $officials = $officials->map(function ($official) {
            if($official->profile_picture_path && Storage::exists($official->profile_picture_path)){
                $official->profile_picture_path = Storage::url($official->profile_picture_path);
            } else {
                $official->profile_picture_path = null;
            }
            return $official;
        });
        $page = ContentPages::where('page', 'Administration')->first();

        return inertia('about/admin', [
            'officials' => $officials,
            'page' => $page,
        ]);
    }
}

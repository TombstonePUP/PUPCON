<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\UniversityAdministration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\ContentPages;
use Inertia\Response;

class AdministrationViewController extends Controller
{
    /**
     * Handle the incoming request.
     * @return Response
     */
    public function __invoke(Request $request)
    {
        $officials = UniversityAdministration::all();
        $officials = $officials->map(function ($official) {
            $official->profile_picture_path = $official->profile_picture_path ? Storage::url($official->profile_picture_path) : null;
            return $official;
        });
        $page = ContentPages::where('page', 'Administration')->first();

        return inertia('guest/about/admin', [
            'officials' => $officials,
            'page' => $page,
        ]);
    }
}

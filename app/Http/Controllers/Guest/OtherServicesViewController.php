<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\OtherServices;
use Illuminate\Http\Request;
use App\Models\ContentPages;
use Inertia\Response;

class OtherServicesViewController extends Controller
{
    /**
     * Handle the incoming request.
     * @return Response
     */
    public function __invoke(Request $request)
    {

        $page = ContentPages::where('page', 'Other Services')->first();
        $others = OtherServices::all();

        return inertia('others', [
            'page' => $page,
            'others' => $others,
        ]);

    }
}

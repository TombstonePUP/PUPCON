<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\ContentPages;
use App\Models\OtherServices;
use Illuminate\Http\Request;
use Inertia\Response;

class OtherServicesViewController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(): Response
    {

        $page = ContentPages::where('page', 'Other Services')->first();
        $others = OtherServices::all();

        return inertia('guest/others', [
            'page' => $page,
            'others' => $others,
        ]);

    }
}

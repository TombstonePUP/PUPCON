<?php

namespace App\Http\Controllers\Documents;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DocumentRatingsController extends Controller
{
    /**
     * Show the document ratings page.
     */
    public function index(): Response
    {
        return Inertia::render('document/ratings');
    }
}

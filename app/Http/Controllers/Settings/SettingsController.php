<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /**
     * Show the archive settings page.
     */
    public function archive(): Response
    {
        return Inertia::render('admin/settings/archive');
    }

    /**
     * Show the appearance settings page.
     */
    public function appearance(): Response
    {
        return Inertia::render('admin/settings/appearance');
    }
}

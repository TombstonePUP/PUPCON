<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $activityLog = app(ActivityLogController::class)->index();
        $frequency = app(DocumentUploadFrequencyController::class)->index();
        $areaUploads = app(AreaUploadsController::class)->index();
        $overallUploads = app(OverallUploadsController::class)->index();
        // dd([$activityLog, $frequency, $areaUploads, $overallUploads]);
        return Inertia::render('dashboard', [
            'activityLogs' => $activityLog,
            'frequencyUploads' => $frequency,
            'areaUploads' => $areaUploads,
            'overallUploads' => $overallUploads
        ]);
    }
}

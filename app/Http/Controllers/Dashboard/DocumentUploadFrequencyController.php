<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DocumentUploadFrequencyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $frequency = ActivityLog::selectRaw("
            activity_date::date as activity_date,
            count(*)  as activity")
            ->groupByRaw("activity_date::date")
            ->orderBy('activity_date')
            ->get();
        return $frequency;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): void
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): void
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ActivityLog $activityLog): void
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ActivityLog $activityLog): void
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ActivityLog $activityLog): void
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ActivityLog $activityLog): void
    {
        //
    }
}

<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Collection<int,Model>
     */
    public function index(): Collection
    {
        $activityLogs = ActivityLog::with('Users.ActivityLogs')->orderBy('activity_date', 'desc')->get();
        $activityLogs->transform(function ($activityLog) {
            $activityLog->activity_date = Carbon::parse($activityLog->activity_date)->format('M d,Y');
            return $activityLog;
        });
        return $activityLogs;
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

<?php
namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\AreaFiles;
use Illuminate\Http\Request;

class AreaUploadsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $areaUploads = ActivityLog::selectRaw("
            area,
            count(*) as uploads")
            ->groupBy('area')
            ->orderByRaw('max(activity_date) desc')
            ->limit(5)
            ->get();
        return $areaUploads;
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
    public function show(AreaFiles $areaFiles): void
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AreaFiles $areaFiles): void
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AreaFiles $areaFiles): void
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AreaFiles $areaFiles): void
    {
        //
    }
}

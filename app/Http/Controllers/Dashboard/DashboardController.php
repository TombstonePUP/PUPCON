<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\FilesOverview;
use App\Models\ExhibitOutlines;
use App\Models\ParameterOutlines;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $activityLog = $this->activityLog();
        $frequency = $this->documentUploadFrequency();
        $areaUploads = $this->areaUploads();
        $overallUploads = $this->overallUploads();
        return Inertia::render('dashboard', [
            'activityLogs' => $activityLog,
            'frequencyUploads' => $frequency,
            'documentStatistics' => $areaUploads,
            'overallUploads' => $overallUploads
        ]);
    }

    /**
     * @return Collection<int,Model>
     */
    public function activityLog(): Collection
    {
        $activityLogs = ActivityLog::with('Users.ActivityLogs')->orderBy('activity_date', 'desc')->get();
        $activityLogs->transform(function ($activityLog) {
            $activityLog->activity_date = Carbon::parse($activityLog->activity_date)->format('M d,Y');
            return $activityLog;
        });
        return $activityLogs;
    }

    /**
     * @return Collection<int,Model>
     */
    public function documentUploadFrequency(): Collection
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
     * @return Collection<int,Model>
     */
    public function areaUploads(): Collection
    {
        $areaUploads = FilesOverview::selectRaw("file_status, count(*) as documents")
            ->groupBy("file_status")
            ->orderBy("file_status")
            ->get();
        return $areaUploads;
    }

    /**
     * Calculate overall uploads from area and exhibit outlines.
     *
     * @return Collection<int,Model>
     */
    public function overallUploads(): Collection
    {
        $area_files = ParameterOutlines::from('parameter_outlines AS po')
            ->leftJoin('area_files AS af', 'po.parameter_outline_id', '=', 'af.parameter_outline_id')
            ->selectRaw("
                'area_file' AS document_type,
                COUNT(*) FILTER (WHERE po.container = 'true') AS outlines,
                COUNT(af.area_file_id) AS documents
            ");
        $exhibit_files = ExhibitOutlines::from('exhibit_outlines AS eo')
            ->leftJoin('exhibit_files AS ef', 'eo.exhibit_outline_id', '=', 'ef.exhibit_outline_id')
            ->selectRaw("
                'exhibit_file' AS document_type,
                COUNT(*) FILTER (WHERE eo.container = 'true') AS outlines,
                COUNT(ef.exhibit_file_id) AS documents
            ");
        $overall_uploads = $area_files->union($exhibit_files)->get();
        return $overall_uploads;
    }
}

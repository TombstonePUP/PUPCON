<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\AreaForms;
use App\Models\ExhibitOutlines;
use App\Models\FilesOverview;
use App\Models\ParameterOutlines;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
        $documentStatus = $this->documentStatus();
        $documentUploads = $this->documentUploads();

        return Inertia::render('admin/dashboard', [
            'activityLogs' => $activityLog,
            'frequencyUploads' => $frequency,
            'documentStatistics' => $documentStatus,
            'overallUploads' => $documentUploads,
        ]);
    }

    /**
     * @return Collection<int,Model>
     */
    private function activityLog(): Collection
    {
        $user = Auth::user();
        $role = $user->Roles->role_name;
        if ($role == 'Coordinator' || $role == 'Admin') {
            $activityLogs = ActivityLog::from('activity_log as al')
                ->join('users as u', 'al.user_id', '=', 'u.user_id')
                ->select(
                    'al.activity_log_id',
                    DB::raw("concat(u.first_name, ' ', u.last_name) as full_name"),
                    'al.description',
                    'al.activity',
                    'al.type',
                    'al.activity_date'
                )
                ->orderBy('al.activity_date', 'desc')
                ->get();
            $activityLogs->transform(function ($activityLog) {
                $activityLog->activity_date = Carbon::parse($activityLog->activity_date)->format('M d,Y');

                return $activityLog;
            });
        }
        if ($role == 'Chairman') {
            $activityLogs = ActivityLog::from('activity_log as al')
                ->join('users as u', 'al.user_id', '=', 'u.user_id')
                ->select(
                    'al.activity_log_id',
                    DB::raw("concat(u.first_name, ' ', u.last_name) as full_name"),
                    'al.description',
                    'al.activity',
                    'al.type',
                    'al.activity_date'
                )
                ->where('al.type', 'ILIKE', 'Files')
                ->where('al.user_id', $user->user_id)
                ->orderBy('al.activity_date', 'desc')
                ->get();
            $activityLogs->transform(function ($activityLog) {
                $activityLog->activity_date = Carbon::parse($activityLog->activity_date)->format('M d,Y');

                return $activityLog;
            });
        }

        return $activityLogs;
    }

    /**
     * @return Collection<int,Model>
     */
    private function documentUploadFrequency(): Collection
    {
        $frequency = ActivityLog::selectRaw('
            activity_date::date as activity_date,
            count(*)  as activity')
            ->groupByRaw('activity_date::date')
            ->orderBy('activity_date')
            ->get();

        return $frequency;
    }

    /**
     * @return Collection<int,Model>
     */
    private function documentStatus(): Collection
    {
        $areaUploads = FilesOverview::selectRaw('file_status, count(*) as documents')
            ->groupBy('file_status')
            ->orderBy('file_status')
            ->get();

        return $areaUploads;
    }

    /**
     * Calculate overall uploads from area and exhibit outlines.
     *
     * @return Collection<int,Model>
     */
    private function documentUploads(): Collection
    {
        $area_files = ParameterOutlines::from('parameter_outlines AS po')
            ->leftJoin('area_files AS af', 'po.parameter_outline_id', '=', 'af.parameter_outline_id')
            ->leftJoin('area_parameters AS ap', 'po.area_parameter_id', '=', 'ap.area_parameter_id')
            ->leftJoin('areas AS a', 'ap.area_id', '=', 'a.area_id')
            ->leftJoin('accreditation_levels AS al', 'a.accreditation_level_id', '=', 'al.accreditation_level_id')
            ->selectRaw("
            'area_files' AS document_type,
            GREATEST(COUNT(*) FILTER (WHERE po.container = 'false') - COUNT(af.area_file_id),0) AS outlines,
            COUNT(af.area_file_id) AS documents
        ")
            ->where('al.remarks', 'Ongoing Survey');

        $area_forms = AreaForms::from('area_forms AS afs')
            ->leftJoin('areas AS a', 'afs.area_id', '=', 'a.area_id')
            ->leftJoin('accreditation_levels AS al', 'a.accreditation_level_id', '=', 'al.accreditation_level_id')
            ->where('al.remarks', 'Ongoing Survey')
            ->selectRaw("
            'area_forms' AS document_type,
            GREATEST(COUNT(*) FILTER (WHERE afs.file_path IS NOT NULL) - COUNT(afs.area_form_id),0) AS outlines,
            COUNT(afs.area_form_id) AS documents
        ");

        $exhibit_files = ExhibitOutlines::from('exhibit_outlines AS eo')
            ->leftJoin('exhibit_files AS ef', 'eo.exhibit_outline_id', '=', 'ef.exhibit_outline_id')
            ->selectRaw("
            'exhibit_files' AS document_type,
            COUNT(*) FILTER (WHERE ef.exhibit_file_id IS NULL) AS outlines,
            COUNT(ef.exhibit_file_id) AS documents
        ");

        return $area_files
            ->unionAll($area_forms)
            ->unionAll($exhibit_files)
            ->get();
    }
}

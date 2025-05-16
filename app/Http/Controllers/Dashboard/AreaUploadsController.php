<?php
namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\FilesOverview;
use Illuminate\Http\Request;

class AreaUploadsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $areaUploads = FilesOverview::selectRaw("file_status, count(*) as documents")
            ->groupBy("file_status")
            ->orderBy("file_status")
            ->get();
        return $areaUploads;
    }
}

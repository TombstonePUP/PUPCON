<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\AreaFiles;
use App\Models\ExhibitOutlines;
use App\Models\ParameterOutlines;
use Illuminate\Http\Request;

class OverallUploadsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $area_files = ParameterOutlines::from('parameter_outlines AS po')
            ->leftJoin('area_files AS af', 'po.parameter_outline_id', '=', 'af.parameter_outline_id')
            ->selectRaw("
                COUNT(*) FILTER (WHERE po.container = 'true') AS outlines,
                COUNT(af.area_file_id) AS documents
            ")
            ->first();
        $exhibit_files = ExhibitOutlines::from('exhibit_outlines AS eo')
            ->leftJoin('exhibit_files AS ef', 'eo.exhibit_outline_id', '=', 'ef.exhibit_outline_id')
            ->selectRaw("
                COUNT(*) FILTER (WHERE eo.container = 'true') AS outlines,
                COUNT(ef.exhibit_file_id) AS documents
            ")
            ->first();
        $area_outlines = $area_files->outlines;
        $area_documents = $area_files->documents;
        $exhibit_outlines = $exhibit_files->outlines;
        $exhibit_documents = $exhibit_files->documents;
        $overall_uploads = [
            'outlines' => $area_outlines + $exhibit_outlines,
            'documents' => $area_documents + $exhibit_documents,
        ];
        return $overall_uploads;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(AreaFiles $areaFiles)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AreaFiles $areaFiles)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AreaFiles $areaFiles)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AreaFiles $areaFiles)
    {
        //
    }
}

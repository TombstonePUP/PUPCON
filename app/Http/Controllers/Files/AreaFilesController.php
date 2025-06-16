<?php

namespace App\Http\Controllers\Files;

use App\Http\Controllers\Controller;
use App\Models\AreaFiles;
use App\Models\AreaFormCategory;
use App\Models\AreaForms;
use App\Models\Areas;
use App\Models\ParameterOutlineCategory;
use App\Models\Programs;
use Illuminate\Http\Request;

class AreaFilesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(string $program_name, string $area_id)
    {
        $program = Programs::select('program_id', 'program_name', 'degree_type')
            ->where('program_name', $program_name)
            ->with('Areas')
            ->firstOrFail();
        $area = Areas::select('area_id', 'area_name', 'area_number', 'program_id')
            ->where('program_id', $program->program_id)
            ->where('area_id', $area_id)
            ->with([
                'Programs',
                'AreaParameters.ParameterOutlines.ParameterOutlineCategory',
                'AreaParameters.ParameterOutlines.AreaFiles.FileStatus',
                'AreaForms.AreaFormCategory',
                'AreaForms.FileStatus'])
            ->firstOrFail();
        $parameterOutlineCategories = ParameterOutlineCategory::with([
            'ParameterOutlines' => function ($query) use ($area) {
                $query->whereHas('AreaParameter', function ($q) use ($area) {
                    $q->where('area_id', $area->area_id);
                });
            },
            'ParameterOutlines.AreaFiles.FileStatus',
            'ParameterOutlines.AreaParameter.Areas'])
            ->get();

        // $parameters = $area->AreaParameters()
        //     ->with(['ParameterOutlines.ParameterOutlineCategory', 'ParameterOutlines.AreaFiles.FileStatus'])
        //     ->get();
        //
        // $areaForms = $area->AreaForms()
        //     ->with(['AreaFormCategory', 'FileStatus'])
        //     ->get();

        /* $parameterOutlines = collect();
        foreach ($parameters as $parameter) {
            $parameterOutlines = $parameterOutlines->merge($parameter->ParameterOutlines);
        }
        $areaFormCategories = AreaFormCategory::all(); */
        /* $areaForms = AreaForms::from('area_forms as af')
            ->leftjoin('areas as a', 'af.area_id', '=', 'a.area_id')
            ->leftjoin('area_form_categories as afc', 'af.area_form_category_id', '=', 'afc.area_form_category_id')
            ->leftjoin('file_status as fs', 'af.file_status_id', '=', 'fs.file_status_id')
            ->where('a.area_id', $area->area_id)
            ->select(
                'af.area_form_id',
                'afc.category_name',
                'af.form_image_name',
                'af.form_image_path',
                'af.file_name',
                'af.file_path',
                'fs.status_name as file_status',
                'af.file_rejection_reason'
            )
            ->get();

        $areaFiles = AreaFiles::from('area_files as af')
            ->leftjoin('parameter_outlines as po', 'af.parameter_outline_id', '=', 'po.parameter_outline_id')
            ->leftjoin('file_status as fs', 'af.file_status_id', '=', 'fs.file_status_id')
            ->leftjoin('parameter_outline_category as poc', 'po.parameter_outline_category_id', '=', 'poc.parameter_outline_category_id')
            ->leftjoin('area_parameters as ap', 'po.area_parameter_id', '=', 'ap.area_parameter_id')
            ->leftjoin('areas as a', 'ap.area_id', '=', 'a.area_id')
            ->leftjoin('programs as p', 'a.program_id', '=', 'p.program_id')
            ->where('ap.area_id', $area->area_id)
            ->select(
                'af.area_file_id',
                'ap.parameter_name',
                'ap.parameter_description',
                'po.parameter_outline_id',
                'po.outline_number',
                'po.outline_name',
                'poc.category_name',
                'af.file_name',
                'af.file_path',
                'fs.status_name as file_status',
                'af.file_rejection_reason'
            )
            ->get(); */

        return inertia('document/area', [
            'program' => $program,
            'area' => $area,
            'parameterOutlineCategories' => $parameterOutlineCategories,
            // 'parameters' => $parameters,
            /* 'parameterOutlines' => $parameterOutlines,
            'areaFormCategories' => $areaFormCategories, */
            // 'areaForms' => $areaForms,
            // 'areaFiles' => $areaFiles,
        ]);
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

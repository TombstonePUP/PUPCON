<?php

namespace App\Http\Controllers\Files;

use App\Http\Controllers\Controller;
use App\Models\AreaFiles;
use App\Models\AreaFormCategory;
use App\Models\AreaForms;
use App\Models\Areas;
use App\Models\ParameterOutlineCategory;
use App\Models\Programs;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class AreaFilesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(string $program_name, string $area_id)
    {
        $program = Str::of($program_name)->replace('_', ' ')->title();
        $program = Programs::select('program_id', 'program_name', 'degree_type')
            ->where('program_name', $program)
            ->with('Areas')
            ->firstOrFail();
        $program->program_link = $program_name;
        $area = Areas::select('area_id', 'area_name', 'area_number', 'program_id')
            ->where('area_id', $area_id)
            ->where('program_id', $program->program_id)
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

        $areaFormsCategories = AreaFormCategory::select('*')->get();

        $area->AreaParameters->map(function ($parameter) {
            $parameter->ParameterOutlines->map(function ($outline) {
                if ($outline->AreaFiles) {
                    $outline->AreaFiles->file_path = Storage::url($outline->AreaFiles->file_path);
                }
                return $outline;
            });
            return $parameter;
        });

        $area->AreaForms->map(function ($form) {
            if ($form) {
                $form->file_path = Storage::url($form->file_path);
            }
            return $form;
        });


        return inertia('document/area', [
            'program' => $program,
            'area' => $area,
            'parameterOutlineCategories' => $parameterOutlineCategories,
            'areaFormsCategories' => $areaFormsCategories,
        ]);
    }

}

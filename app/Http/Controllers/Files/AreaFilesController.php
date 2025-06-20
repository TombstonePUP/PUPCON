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
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;

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

        /* foreach ($area->AreaParameters ?? [] as $parameter) {
            foreach ($parameter->ParameterOutlines ?? [] as $outline) {
                foreach ($outline->AreaFiles ?? [] as $file) {
                    try {
                        $file->file_name = Crypt::decryptString($file->file_name);
                        $file->file_path = Crypt::decryptString($file->file_path);
                    } catch (\Exception $e) {
                        $file->file_name = $file->file_name;
                        $file->file_path = $file->file_path;
                    }
                }
            }
        } */
        foreach ($area->AreaParameters ?? [] as $parameter) {
            foreach ($parameter->ParameterOutlines ?? [] as $outline) {
                foreach ($outline->AreaFiles ?? [] as $file) {
                    if (is_object($file) && isset($file->file_name)) {
                        $file->file_name = Crypt::decryptString($file->file_name);
                        $file->file_path = Crypt::decryptString($file->file_path);
                    }
                }
            }
        }

        dd($area->AreaParameters->where('parameter_name', 'provident'));

        return inertia('document/area', [
            'program' => $program,
            'area' => $area,
            'parameterOutlineCategories' => $parameterOutlineCategories,
        ]);
    }

}

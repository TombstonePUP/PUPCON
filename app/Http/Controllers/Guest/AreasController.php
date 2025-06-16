<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Guest\ProgramsController;
use App\Models\Areas;
use App\Models\ParameterOutlineCategory;
use App\Models\Programs;
use Illuminate\Http\Request;

class AreasController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(string $program_name, int $area_id)
    {
        $program = Programs::where('program_name',$program_name)->firstOrFail();
        $area = Areas::select('area_id', 'area_name', 'area_number', 'area_description', 'area_image_name', 'area_image_path', 'program_id')
            ->where('area_id', $area_id)
            ->where('program_id', $program->program_id)
            ->with([
                'AreaParameters.ParameterOutlines.AreaFiles' => function ($query) {
                    $query->whereHas('FileStatus', function ($q) {
                        $q->where('status_name', 'Approved');
                    });
                },
                'AreaParameters.ParameterOutlines.ParameterOutlineCategory',
                'AreaForms.AreaFormCategory',
                'AreaForms' => function ($query) {
                    $query->whereHas('FileStatus', function ($q) {
                        $q->where('status_name', 'Approved');
                    });
                },
            ])
            ->firstOrFail();

        $area->area_numeral = ProgramsController::numericalToRoman($area->area_number);
        $parameterOutlineCategories = ParameterOutlineCategory::select('*')->get();

        return inertia('area', [
            'area' => $area,
            'program' => $program,
            'categories' => $parameterOutlineCategories,
        ]);
    }
}

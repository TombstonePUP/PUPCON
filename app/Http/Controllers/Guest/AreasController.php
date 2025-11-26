<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Guest\ProgramsController;
use App\Models\Areas;
use App\Models\ParameterOutlineCategory;
use App\Models\Programs;
use App\Traits\AreaNumeralFormat;
use App\Traits\ProgramLinkFormats;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class AreasController extends Controller
{
    use ProgramLinkFormats;
    use AreaNumeralFormat;
    /**
     * Handle the incoming request.
     */
    public function __invoke(string $program_name, int $area_id)
    {
        $program_name = Str::of($program_name)->replace('_', ' ')->title();
        $program = Programs::where('program_name', $program_name)->with([
            'Levels' => function ($query) {
                $query->where('is_active', true);
            },
        ])->firstOrFail();

        $program->program_link = $program_name;

        $area = Areas::select('area_id', 'area_name', 'area_number', 'area_description', 'area_image_name', 'area_image_path')
            ->where('area_id', $area_id)
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

        $area->area_numeral = $this->toRoman($area->area_number);
        $parameterOutlineCategories = ParameterOutlineCategory::select('*')->get();

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
                if ($form->file_path && Storage::exists($form->file_path)) {
                    $form->file_path = Storage::url($form->file_path);
                } else {
                    $form->file_path = null;
                }
            }
            return $form;
        });

        return inertia('area', [
            'area' => $area,
            'program' => $program,
            'categories' => $parameterOutlineCategories,
        ]);
    }
}

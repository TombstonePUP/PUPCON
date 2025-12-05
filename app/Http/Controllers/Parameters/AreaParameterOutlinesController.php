<?php

namespace App\Http\Controllers\Parameters;

use App\Http\Controllers\Controller;
use App\Http\Requests\Benchmarks\BenchmarkRequest;
use App\Models\ActivityLog;
use App\Models\Areas;
use App\Models\AreaFormCategory;
use App\Models\ParameterOutlineCategory;
use App\Models\ParameterOutlines;
use App\Models\Programs;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class AreaParameterOutlinesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(string $program_id, int $level_id, string $area_id)
    {
        $program = Programs::select('program_id', 'program_name', 'degree_type')
            ->where('program_id', $program_id)
            ->with([
                'Levels' => function ($query) use ($level_id) {
                    $query->where('accreditation_level_id', $level_id);
                }
            ])
            ->firstOrFail();
        $program->program_link = Str::slug($program->program_name, '_');
        $area = Areas::select('area_id', 'area_name', 'area_number', 'accreditation_level_id', 'archive')
            ->where('area_id', $area_id)
            ->where('accreditation_level_id', $level_id)
            ->with([
                'Levels',
                'AreaParameters.ParameterOutlines.ParameterOutlineCategory',
                'AreaParameters.ParameterOutlines.AreaFiles.FileStatus',
                'AreaForms.AreaFormCategory',
                'AreaForms.FileStatus'
            ])
            ->firstOrFail();
        $parameterOutlineCategories = ParameterOutlineCategory::with([
            'ParameterOutlines' => function ($query) use ($area) {
                $query->whereHas('AreaParameter', function ($q) use ($area) {
                    $q->where('area_id', $area->area_id);
                });
            },
            'ParameterOutlines.AreaFiles.FileStatus',
            'ParameterOutlines.AreaParameter.Areas'
        ])
            ->get();

        $areaFormsCategories = AreaFormCategory::select('*')->get();

        $area->AreaParameters->map(function ($parameter) {
            $parameter->ParameterOutlines->map(function ($outline) {
                if ($outline->AreaFiles) {
                    if ($outline->AreaFiles->file_path && Storage::url($outline->AreaFiles->file_path)) {
                        $outline->AreaFiles->file_path = Storage::url($outline->AreaFiles->file_path);
                    }
                }
                return $outline;
            });
            return $parameter;
        });

        $area->AreaForms->map(function ($form) {
            if ($form) {
                if ($form->file_path && Storage::url($form->file_path)) {
                    $form->file_path = Storage::url($form->file_path);
                }
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

    /**
     * Store a newly created resource in storage.
     * @return RedirectResponse
     */
    public function store(BenchmarkRequest $request)
    {
        $validated = $request->validated();

        $parameterOutline = new ParameterOutlines();
        $parameterOutline->area_parameter_id = $validated['area_parameter_id'];
        $parameterOutline->parameter_outline_category_id = $validated['benchmark_category'];
        $parameterOutline->outline_number = $validated['benchmark_number'];
        $parameterOutline->outline_description = $validated['benchmark_description'];
        $parameterOutline->container = $validated['is_container'];
        $parameterOutline->save();

        $user = Auth::user();

        ActivityLog::create([
            'user_id' => $user->user_id,
            'activity' => 'Create',
            'description' => "Created benchmark: {$parameterOutline->outline_description}",
            'type' => 'Content',
            'activity_date' => now(),
        ]);

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Create Successful')
            ->with('message', 'The benchmark has been added.');
    }

    /**
     * Update the specified resource in storage.
     * @return RedirectResponse
     */
    public function edit(BenchmarkRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        // $program = Str::of($request->program_name)->replace('_', ' ')->title();
        $program = Programs::findOrFail($request->program_id);
        $area = Areas::where('area_id', $request->area_id)->first();
        $parameterOutline = ParameterOutlines::find($request->outline_id);

        if ($file = $parameterOutline->AreaFiles) {
            $categoryName = $parameterOutline->parameterOutlineCategory->category_name;
            $parameterName = $parameterOutline->AreaParameter->parameter_name;
            if ($categoryName === 'No Category') {
                $initial = substr($parameterName, 0, 1);
            } else {
                $initial = substr($categoryName, 0, 1);
            }
            $categoryName = $categoryName === "Outcome/s" ? substr($categoryName, 0, -2) : $categoryName;
            $fileName = $initial . '.' . ($validated['benchmark_number'] ?? $parameterOutline->outline_number) . '.' .
                ($validated['benchmark_description'] ?? $parameterOutline->outline_description) . '.' .
                pathinfo($file->file_name, PATHINFO_EXTENSION);
            $level = $program->accreditation_level === 0 ? 'Preliminiary Survey Visit' : 'Level ' . $program->accreditation_level;
            $filePath = "{$program->program_name}/{$level}/{$area->area_name}/{$parameterName}/{$categoryName}";
            $filePath = "{$filePath}/{$fileName}";
            Storage::disk('public')->move($file->file_path, $filePath);
            $file->file_name = $fileName;
            $file->file_path = $filePath;
            $file->save();
        }

        $cateogry = $validated['benchmark_category'] === 0 ? $parameterOutline->parameter_outline_category_id : $validated['benchmark_category'];
        $parameterOutline->parameter_outline_category_id = $cateogry;
        $parameterOutline->outline_number = $validated['benchmark_number'] ?? $parameterOutline->outline_number;
        $parameterOutline->outline_description = $validated['benchmark_description'] ?? $parameterOutline->outline_description;
        $parameterOutline->container = $validated['is_container'] ?? $parameterOutline->container;
        $parameterOutline->save();

        $user = Auth::user();
        ActivityLog::create([
            'user_id' => $user->user_id,
            'activity' => 'Update Benchmark',
            'description' => "Updated benchmark: {$parameterOutline->outline_description}",
            'type' => 'Content',
            'activity_date' => now(),
        ]);

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Update Successful')
            ->with('message', 'The benchmark has been updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $parameterOutlines = ParameterOutlines::where('parameter_outline_id', $request->outline_id)->first();
        $user = Auth::user();
        $area = Areas::where('area_id', $request->area_id)->first();
        // $program = Str::of($request->program_name)->replace('_', ' ')->title();
        // $program = Programs::where('program_name', 'ILIKE', $program)->first();
        $program = Programs::findOrFail($request->program_id);

        $message = "";

        if ($file = $parameterOutlines->AreaFiles) {
            Storage::disk('public')->delete($file->file_path);
            $file->delete();
            $activityLog = new ActivityLog();
            $activityLog->user_id = $user->user_id;
            $activityLog->description = "Deleted document for benchmark '{$parameterOutlines->outline_description}' in {$program->program_name} - {$area->area_name}.";
            $activityLog->activity = "Delete Document";
            $activityLog->type = "Files";
            $activityLog->activity_date = now();
            $activityLog->save();
            $message = "The benchmark and its associated document have been deleted.";
        } else {
            $message = "The benchmark has been deleted.";
            $activityLog = new ActivityLog();
            $activityLog->user_id = $user->user_id;
            $activityLog->description = "Deleted benchmark '{$parameterOutlines->outline_description}' in {$program->program_name} - {$area->area_name}.";
            $activityLog->activity = "Delete";
            $activityLog->type = "Content";
            $activityLog->activity_date = now();
            $activityLog->save();
        }

        $parameterOutlines->delete();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Delete Successful')
            ->with('message', $message);
    }
}

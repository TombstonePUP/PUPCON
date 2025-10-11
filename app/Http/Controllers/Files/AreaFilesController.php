<?php

namespace App\Http\Controllers\Files;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\AreaFiles;
use App\Models\AreaFormCategory;
use App\Models\Areas;
use App\Models\FileStatus;
use App\Models\ParameterOutlineCategory;
use App\Models\ParameterOutlines;
use App\Models\Programs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'outline_id' => 'nullable|exists:parameter_outlines,parameter_outline_id',
            'document' => 'required|file|mimes:pdf'
        ],
        [
            'outline_id.exists' => 'The selected outline does not exist.',
            'document.required' => 'Please upload a PDF document.',
            'document.file' => 'The uploaded file must be a valid file.',
            'document.pdf' => 'The uploaded file must be a PDF document.'
        ]);

        $program = Str::of($request->program_name)->replace('_', ' ')->title();
        $program = Programs::where('program_name', $program)->first();
        $area = Areas::where('area_id', $request->area_id)->first();
        $parameterOutlines = ParameterOutlines::find($validated['outline_id']);

        $user = Auth::user();
        if ($user->Roles->role_name === 'Coordinator' || $user->Roles->role_name === 'Admin') {
            $fileStatus = FileStatus::where('status_name', 'Approved')->first()->file_status_id;
        } else {
            $fileStatus = FileStatus::where('status_name', 'Pending')->first()->file_status_id;
        }

        $activityLog = new ActivityLog();
        if ($file = $parameterOutlines->AreaFiles) {
            Storage::disk('public')->delete($file->file_path);
            $file->delete();
            $activityLog->activity = 'Update Document';
        } else {
            $activityLog->activity = 'Upload Document';
        }

        $categoryName = $parameterOutlines->parameterOutlineCategory->category_name;
        $parameterName = $parameterOutlines->AreaParameter->parameter_name;
        if ($categoryName === 'No Category') {
            $initial =substr($parameterName, 0, 1);
        } else {
            $initial = substr($categoryName, 0, 1);
        }
        $categoryName = $categoryName === "Outcome/s" ? substr($categoryName, 0, -2) : $categoryName;

        $file = $validated['document'];
        $fileName = $initial . '.' . $parameterOutlines->outline_number . '.' . $parameterOutlines->outline_description . $file->getClientOriginalExtension();
        $level = $program->accreditation_level === 0 ? 'Preliminiary Survey Visit' : 'Level ' . $program->accreditation_level;
        $filePath = "{$program->program_name}/{$level}/{$area->area_name}/{$parameterName}/{$categoryName}";
        $validated['document']->storeAs($filePath, $fileName, 'public');
        $filePath = "{$filePath}/{$fileName}";


        $areaFile = $parameterOutlines->AreaFiles()->create([
            'file_name' => $fileName,
            'file_path' => $filePath,
            'file_status_id' => $fileStatus,
        ]);

        $activityLog->user_id = $user->user_id;
        $activityLog->area = $area->area_name;
        $activityLog->program = $program->program_name;
        $activityLog->activity_date = now();
        $activityLog->file_name = $fileName;
        $activityLog->save();

        // $parameterOutlines->save();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Upload Successful')
            ->with('message', 'The Document has been uploaded.');
    }

    /**
     * Destroy the specified resource from storage.
     */
    public function destroy(Request $request)
    {

        $parameterOutlines = ParameterOutlines::where('parameter_outline_id', $request->outline_id)->first();
        $areaFile = $parameterOutlines->AreaFiles;
        $user = Auth::user();
        $area = Areas::where('area_id', $request->area_id)->first();
        $program = Str::of($request->program_name)->replace('_', ' ')->title();
        $program = Programs::where('program_name', $program)->first();

        if ($areaFile) {
            Storage::disk('public')->delete($areaFile->file_path);
            $areaFile->delete();

            $activityLog = new ActivityLog();
            $activityLog->activity = "Delete Document";
            $activityLog->user_id = $user->user_id;
            $activityLog->area = $area->area_name;
            $activityLog->program = $program->program_name;
            $activityLog->activity_date = now();
            $activityLog->file_name = $areaFile->file_name;
            $activityLog->save();
        }

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Delete Successful')
            ->with('message', 'The Document has been deleted.');
    }
}

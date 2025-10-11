<?php

namespace App\Http\Controllers\Files;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Areas;
use App\Models\FileStatus;
use App\Models\ParameterOutlines;
use App\Models\Programs;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;

class AreaParameterOutlinesController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return void
     */
    public function index(): void
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     * @return void
     */
    public function create(): void
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     * @return RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'area_parameter_id' => 'required|integer',
            'parameter_outline_category_id' => 'required|integer',
            'outline_number' => 'required|string|max:10',
            'outline_description' => 'nullable|string|max:1000',
            'container' => 'nullable|boolean',
        ]);

        $parameterOutline = new ParameterOutlines();
        $parameterOutline->create($validated);

        return redirect()->back()
            ->with('success', 'Parameter outline created successfully.');
    }

    /**
     * Display the specified resource.
     * @return void
     */
    public function show(ParameterOutlines $parameterOutlines)
    {
    }

    /**
     * Show the form for editing the specified resource.
     * @return void
     */
    public function edit(ParameterOutlines $parameterOutlines): void
    {
        //
    }

    /**
     * Update the specified resource in storage.
     * @return RedirectResponse
     */
    public function update(Request $request, ParameterOutlines $parameterOutlines)
    {
        $validated = $request->validate([
            'parameter_outline_category_id' => 'nullable|integer',
            'outline_number' => 'nullable|string|max:10',
            'outline_description' => 'nullable|string|max:1000',
            'container' => 'nullable|boolean',
            'area_file_id' => 'nullable|integer',
            'outline_file' => 'nullable|file|mimes:pdf',
        ]);

        $user = Auth::user();

        $program = $request->program_name;
        $area = Areas::where('area_id', $request->area_id)->first();

        $parameterOutline = $parameterOutlines->with(['areaFiles', 'parameterOutlineCategory', 'AreaParameter'])->find($request->outline_id);
        $parameterOutline->fill(array_filter($validated, fn($value) => $value !== null));
        $parameterOutline->save();

        $activityLog = new ActivityLog();

        if ($request->hasFile('outline_file')) {
            if ($file = $parameterOutline->areaFiles) {
                Storage::disk('public')->delete($file->file_path);
                $file->delete();
                $activityLog->activity = "Update Document";
            } else {
                $activityLog->activity = "Upload Document";
            }

            $file = $request->outline_file;

            $categoryName = $parameterOutline->parameterOutlineCategory->category_name;
            $parameterName = $parameterOutline->AreaParameter->parameter_name;

            if ($categoryName === 'No Category') {
                $initial = substr($parameterName, 0, 1);
            } else {
                $initial = substr($categoryName, 0, 1);
            }

            $categoryName = $categoryName === "Outcome/s" ? substr($categoryName, 0, -2) : $categoryName;

            $fileName = $initial . '.' . $parameterOutline->outline_number . '.' . $parameterOutline->outline_description . '.' . $file->getClientOriginalExtension();
            $filePath = "{$program}/{$area->area_name}/{$parameterName}/{$categoryName}";
            $request->file('outline_file')->storeAs($filePath, $fileName, 'public');

            $filePath = "{$filePath}/{$fileName}";

            $activityLog->user_id = $user->user_id;
            $activityLog->area = $area->area_name;
            $activityLog->program = $program;
            $activityLog->activity_date = now();
            $activityLog->file_name = $fileName;
            $activityLog->save();

            $file_status = FileStatus::where('status_name', 'Pending')->first()->file_status_id;
            $parameterOutline->AreaFiles()->create([
                'file_name' => $fileName,
                'file_path' => $filePath,
                'file_status_id' => $file_status,
            ]);
        }

        return redirect()->back()
            ->with('success', 'Parameter outline updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $parameterOutlines = ParameterOutlines::where('parameter_outline_id', $request->outline_id)->first();
        $user = Auth::user();
        $area = Areas::where('area_id', $request->area_id)->first();
        $program = Str::of($request->program_name)->replace('_', ' ')->title();
        $program = Programs::where('program_name', $program)->first();

        $message = "";

        if ($file = $parameterOutlines->AreaFiles) {
            Storage::disk('public')->delete($file->file_path);
            $file->delete();
            $activityLog = new ActivityLog();
            $activityLog->user_id = $user->user_id;
            $activityLog->area = $area->area_name;
            $activityLog->program = $program->program_name;
            $activityLog->file_name = $file->file_name;
            $activityLog->activity = "Delete Document";
            $activityLog->activity_date = now();
            $activityLog->save();
            $message = "The benchmark and its associated document have been deleted.";
        } else {
            $message = "The benchmark has been deleted.";
        }

        $parameterOutlines->delete();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Delete Successful')
            ->with('message', $message);
    }
}

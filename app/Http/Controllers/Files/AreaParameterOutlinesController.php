<?php

namespace App\Http\Controllers\Files;

use App\Http\Controllers\Controller;
use App\Models\Areas;
use App\Models\FileStatus;
use App\Models\ParameterOutlines;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
    public function show(Request $request, ParameterOutlines $parameterOutlines)
    {
        $parameterOutline = $parameterOutlines->where('parameter_outline_id', $request->outline_id)
            ->with(['areaFiles'])
            ->firstOrFail();

        $parameterOutline->areaFiles->file_name = Crypt::decryptString($parameterOutline->areaFiles->file_name);
        $parameterOutline->areaFiles->file_path = Crypt::decryptString($parameterOutline->areaFiles->file_path);
        // dd(Crypt::decryptString($parameterOutline->areaFiles->file_name), Crypt::decryptString($parameterOutline->areaFiles->file_path));
        dd($parameterOutline->areaFiles->file_name, $parameterOutline->areaFiles->file_path);

        return response()->json($parameterOutline->areaFiles);
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

        $program = $request->program_name;
        $area = Areas::where('area_id', $request->area_id)->first();

        $parameterOutline = $parameterOutlines->with(['areaFiles', 'parameterOutlineCategory', 'AreaParameter'])->find($request->outline_id);
        $parameterOutline->fill(array_filter($validated, fn($value) => $value !== null));
        $parameterOutline->save();

        if ($request->hasFile('outline_file')) {
            if ($file = $parameterOutline->areaFiles) {
                Storage::disk('public')->delete($file->file_path);
                $file->delete();
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

            $fileName = $initial . '.' . $parameterOutline->outline_number . '.' . $parameterOutline->outline_description . $file->getClientOriginalExtension();
            $filePath = "{$program}/{$area->area_name}/{$parameterName}/{$categoryName}";
            $request->file('outline_file')->storeAs($filePath, $fileName, 'public');

            $filePath = "{$filePath}/{$fileName}";

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
    public function destroy(Request $request, ParameterOutlines $parameterOutlines): RedirectResponse
    {
        $parameterOutlines->find($request->outline_id)
            ->delete();

        return redirect()->back()
            ->with('success', 'Parameter outline deleted successfully.');
    }
}

<?php

namespace App\Http\Controllers\Files;

use App\Http\Controllers\Controller;
use App\Models\AreaParameters;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class AreaParameterController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'area_id' => 'required|integer',
            'parameter_name' => 'nullable|string|max:1',
            'parameter_description' => 'string|max:1000',
        ]);
        $validated['parameter_name'] = strtoupper($validated['parameter_name'] ?? '');

        $areaParameter = new AreaParameters();
        $areaParameter->create($validated);

        return redirect()->back()
            ->with('success', 'Area parameter created successfully.');
    }

    public function download()
    {
        $filePath = public_path('/documents/import_parameter.csv');
        $headers = ['Content-Type' => 'text/csv'];
        $fileName = 'parameter_template.csv';
        return response()->download($filePath, $fileName, $headers);
    }

    public function import(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'document' => 'required|file|mimes:csv',
        ], [
            'document.mimes' => 'The document must be a file of type: xlsx, csv.',
            'document.required' => 'Please upload a document to import.',
        ]);

        $file = $validated['document'];
        $record = collect(file($file));
        dd($record);

        return redirect()->back()
            ->with('success', 'Area parameters imported successfully.');
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AreaParameters $areaParameters): RedirectResponse
    {
        $validated = $request->validate([
            'area_id' => 'required|integer',
            'area_parameter_id' => 'required|integer',
            'parameter_name' => 'nullable|string|max:1',
            'parameter_description' => 'string|max:1000',
        ]);
        $validated['parameter_name'] = strtoupper($validated['parameter_name'] ?? '');

        $areaParameters->find($validated['area_parameter_id'])
            ->update([
                'parameter_name' => $validated['parameter_name'],
                'parameter_description' => $validated['parameter_description'],
            ]);

        // $areaParameters->update($validated);

        return redirect()->back()
            ->with('success', 'Area parameter updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, AreaParameters $areaParameters): RedirectResponse
    {
         // dd($request->parameter_id);
        $areaParameters->find($request->parameter_id)->delete();
        // $areaParameters->delete();

        return redirect()->back()
            ->with('success', 'Area parameter deleted successfully.');

    }
}

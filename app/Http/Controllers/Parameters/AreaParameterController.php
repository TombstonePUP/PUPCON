<?php

namespace App\Http\Controllers\Parameters;

use App\Http\Controllers\Controller;
use App\Models\AreaParameters;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

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
            ->with('type', 'success')
            ->with('title', 'Creation Successful')
            ->with('message', 'A new Area Parameter has been added.');
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

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Update Successful')
            ->with('message', 'The Area Parameter has been updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, AreaParameters $areaParameters): RedirectResponse
    {
        $areaParameters->find($request->parameter_id)->delete();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Delete Successful')
            ->with('message', 'The Area Parameter has been deleted.');

    }
}

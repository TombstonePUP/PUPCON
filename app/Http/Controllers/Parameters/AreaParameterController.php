<?php

namespace App\Http\Controllers\Parameters;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\AreaParameters;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

        $user = Auth::user();

        ActivityLog::create([
            'user_id' => $user->user_id,
            'description' => 'Created a new Area Parameter: ' . $validated['parameter_name'] . $validated['parameter_description'],
            'activity' => 'Create',
            'type' => 'Content',
            'activity_date' => now(),
        ]);

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

        $user = Auth::user();
        ActivityLog::create([
            'user_id' => $user->user_id,
            'description' => 'Updated Area Parameter:' . $validated['parameter_name'] . $validated['parameter_description'],
            'activity' => 'Update',
            'type' => 'Content',
            'activity_date' => now(),
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
        $parameter = $areaParameters->find($request->parameter_id);

        $name = $parameter->parameter_name;
        $description = $parameter->parameter_description;

        $parameter->delete();

        $user = Auth::user();
        ActivityLog::create([
            'user_id' => $user->user_id,
            'description' => 'Deleted Area Parameter: ' . $name . $description,
            'activity' => 'Delete',
            'type' => 'Content',
            'activity_date' => now(),
        ]);

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Delete Successful')
            ->with('message', 'The Area Parameter has been deleted.');

    }
}

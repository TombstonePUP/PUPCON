<?php

namespace App\Http\Controllers\Files;

use App\Http\Controllers\Controller;
use App\Models\AreaParameters;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AreaParameterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): void
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): void
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, string $program_name, string $area_name): RedirectResponse
    {
        $request->validate([
            'area_id' => 'required|integer',
            'parameter_name' => 'required|string|max:255',
            'parameter_description' => 'nullable|string|max:1000',
        ]);
        $request->parameter_name = strtoupper($request->parameter_name);

        $areaParameter = AreaParameters::create([
            'area_id' => $request->area_id,
            'parameter_name' => $request->parameter_name,
            'parameter_description' => $request->parameter_description,
        ]);

        return redirect()->back()
            ->with('success', 'Area parameter created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(AreaParameters $areaParameters): void
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AreaParameters $areaParameters): void
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AreaParameters $areaParameters): void
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AreaParameters $areaParameters): void
    {
        //
    }
}

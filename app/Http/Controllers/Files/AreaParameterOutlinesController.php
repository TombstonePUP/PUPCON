<?php

namespace App\Http\Controllers\Files;

use App\Http\Controllers\Controller;
use App\Models\ParameterOutlines;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AreaParameterOutlinesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
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
     */
    public function show(ParameterOutlines $parameterOutlines)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ParameterOutlines $parameterOutlines)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ParameterOutlines $parameterOutlines)
    {
        $validated = $request->validate([
            'area_parameter_id' => 'required|integer',
            'parameter_outline_category_id' => 'required|integer',
            'outline_number' => 'required|string|max:10',
            'outline_description' => 'nullable|string|max:1000',
            'container' => 'nullable|boolean',
        ]);

        $parameterOutline = $parameterOutlines->find($validated['outline_id']);
        $parameterOutline->update($validated);

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

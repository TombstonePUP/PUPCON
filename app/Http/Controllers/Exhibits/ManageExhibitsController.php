<?php

namespace App\Http\Controllers\Exhibits;

use App\Http\Controllers\Controller;
use App\Models\Exhibits;
use Illuminate\Http\Request;

class ManageExhibitsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $exhibits = Exhibits::with(['ExhibitOutlines.ExhibitFiles'])->get();
        return inertia('document/exhibits',[
            'exhibits' => $exhibits,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function store(Request $request)
    {
        dd($request->all());
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Exhibits $exhibits)
    {
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Exhibits $exhibits)
    {
        //
    }
}

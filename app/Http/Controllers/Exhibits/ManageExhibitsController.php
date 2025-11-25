<?php

namespace App\Http\Controllers\Exhibits;

use App\Http\Controllers\Controller;
use App\Models\Exhibits;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ManageExhibitsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $exhibits = Exhibits::with(['ExhibitOutlines.ExhibitFiles'])->get();
        $exhibits = $exhibits->map(function($exhibit) {
            $exhibit->image_path = Storage::url($exhibit->image_path);
            return $exhibit;
        });
        return inertia('document/exhibits',[
            'exhibits' => $exhibits,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'exhibit_name' => ['required', 'string'],
            'image' => ['nullable', 'image', 'max:5120'],
            'container' => ['required', 'boolean'],
        ]);

        $exhibit = new Exhibits();

        if(isset($validated['image'])){
            $imageName = $validated['exhibit_name'] . $validated['image']->getClientOriginalExtension();
            $imagePath = 'exhibits/assets/' . $imageName;
            $validated['image']->storeAs('exhibits/assets', $imageName, 'public');
            $exhibit->image_name = $imageName;
            $exhibit->image_path = $imagePath;
        }

        $exhibit->exhibit_name = $validated['exhibit_name'];
        $exhibit->container = $validated['container'];
        $exhibit->save();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Success')
            ->with('message', 'Exhibit successfully added.');
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
    public function destroy(Request $request)
    {
        $exhibit = Exhibits::find($request->exhibit_id);
        if($exhibit) {
            $exhibit->delete();
            return redirect()->back()
                ->with('type', 'success')
                ->with('title', 'Success')
                ->with('message', 'Exhibit successfully deleted.');
        } else {
            return redirect()->back()
                ->with('type', 'error')
                ->with('title', 'Error')
                ->with('message', 'Exhibit not found.');
        }
    }
}

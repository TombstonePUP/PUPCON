<?php

namespace App\Http\Controllers\Exhibits;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Exhibits;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ManageExhibitsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $exhibits = Exhibits::with(['ExhibitOutlines.ExhibitFiles'])->get();

        $exhibits->map(function ($exhibit) {

            // Convert exhibit image
            if ($exhibit->image_path) {
                $exhibit->image_path = Storage::url($exhibit->image_path);
            }

            // Convert each outline
            $exhibit->ExhibitOutlines->map(function ($outline) {

                // If there is one ExhibitFile, convert its file_path
                if ($outline->ExhibitFiles) {
                    $outline->ExhibitFiles->file_path = $outline->ExhibitFiles->file_path
                        ? Storage::url($outline->ExhibitFiles->file_path)
                        : null;
                }

                return $outline;
            });

            return $exhibit;
        });

        return Inertia::render('admin/document/exhibits', [
            'exhibits' => $exhibits,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'exhibit_id' => ['nullable', 'integer', 'exists:exhibits,exhibit_id'],
            'exhibit_name' => ['required', 'string'],
            'image' => ['nullable', 'image', 'max:5120', 'mimes:jpg,jpeg,png'],
            'container' => ['required', 'boolean'],
        ]);

        $user = Auth::user();

        // Determine if this is an update or create
        $isUpdate = isset($validated['exhibit_id']);

        if ($isUpdate) {
            $exhibit = Exhibits::findOrFail($validated['exhibit_id']);
        } else {
            $exhibit = new Exhibits();
        }

        // Handle image upload if provided
        if (isset($validated['image'])) {
            $imageName = $validated['exhibit_name'] . '.' . $validated['image']->getClientOriginalExtension();
            $imagePath = 'exhibits/assets/' . $imageName;

            $validated['image']->storeAs('exhibits/assets', $imageName, 'public');

            $exhibit->image_name = $imageName;
            $exhibit->image_path = $imagePath;
        }

        // Assign basic fields
        $exhibit->exhibit_name = $validated['exhibit_name'];
        $exhibit->container = $validated['container'];
        $exhibit->save();

        //  AUTO-CREATE OUTLINE IF NOT A CONTAINER
        //  Only for NEW exhibits (not updating)
        if (!$exhibit->container && !$isUpdate) {
            if (!$exhibit->ExhibitOutlines()->exists()) {
                $exhibit->ExhibitOutlines()->create([
                    'outline_description' => $exhibit->exhibit_name,
                    'category' => null,
                ]);
            }
        }

        //  Log activity
        ActivityLog::create([
            'user_id' => $user->user_id,
            'activity' => $isUpdate ? 'Update' : 'Create',
            'description' => ($isUpdate
                ? "Updated exhibit '{$exhibit->exhibit_name}'."
                : "Created exhibit '{$exhibit->exhibit_name}'."),
            'type' => 'Content',
            'activity_date' => now(),
        ]);

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Success')
            ->with('message', $isUpdate
                ? 'Exhibit successfully updated.'
                : 'Exhibit successfully added.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $exhibit = Exhibits::find($request->exhibit_id);
        $user = Auth::user();
        if ($exhibit) {
            $exhibit->delete();
            if ($exhibit->image_path && Storage::disk('public')->exists($exhibit->image_path)) {
                Storage::disk('public')->delete($exhibit->image_path);
            }
            if ($exhibit->ExhibitOutlines) {
                foreach ($exhibit->ExhibitOutlines as $outline) {
                    if ($outline->ExhibitFiles) {
                        if (Storage::disk('public')->exists($outline->ExhibitFiles->file_path)) {
                            Storage::disk('public')->delete($outline->ExhibitFiles->file_path);
                        }
                        $outline->ExhibitFiles->delete();
                    }
                    $outline->delete();
                }
            }

            ActivityLog::create([
                'user_id' => $user->user_id,
                'activity' => 'Delete',
                'description' => "Deleted exhibit '{$exhibit->exhibit_name}'.",
                'type' => 'Content',
                'activity_date' => now(),
            ]);

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

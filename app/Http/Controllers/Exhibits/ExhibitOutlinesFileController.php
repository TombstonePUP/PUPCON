<?php

namespace App\Http\Controllers\Exhibits;

use App\Enums\ActivityLogAction;
use App\Http\Controllers\Controller;
use App\Models\ExhibitFiles;
use App\Models\ExhibitOutlines;
use App\Models\Exhibits;
use App\Models\FileStatus;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ExhibitOutlinesFileController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function upload(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'outline_id' => ['nullable', 'integer'],
            'exhibit_id' => ['required', 'integer'],
            'outline_description' => ['required', 'string'],
            'category' => ['required', 'string'],
            'file' => ['nullable', 'file', 'mimes:pdf'],
        ], [
            'exhibit_id.required' => 'The exhibit ID is required.',
            'exhibit_id.integer' => 'The exhibit ID must be an integer.',
            'outline_description.required' => 'The outline description is required.',
            'outline_description.string' => 'The outline description must be a string.',
            'category.required' => 'The category is required.',
            'category.string' => 'The category must be a string.',
            'category.max' => 'The category may not be greater than 255 characters.',
            'file.file' => 'The file must be a file.',
            'file.mimes' => 'The file must be a file of type: pdf.',
        ]);

        $user = Auth::user();

        $outline = isset($validated['outline_id'])
            ? ExhibitOutlines::find($validated['outline_id'])
            : null;
        $exhibit = Exhibits::findOrFail($validated['exhibit_id']);
        $exhibit_name = Str::slug($exhibit->exhibit_name, '_');
        $user = Auth::user();
        $file_status = ($user->Roles->role_name === 'Coordinator' || $user->Roles->role_name === 'Admin')
            ? FileStatus::where('status_name', 'Approved')->first()->file_status_id
            : FileStatus::where('status_name', 'Pending')->first()->file_status_id;

        $existing_file = $outline ? $outline->ExhibitFiles()->first() : null;
        $old_file_path = $existing_file ? $existing_file->file_path : null;

        $outline_slug = Str::slug($validated['outline_description'], '_');
        $file_name = $outline_slug.'.pdf';
        $category_slug = Str::slug($validated['category'], '_');
        $file_path = 'exhibits/'.$exhibit_name.'/'.$category_slug.'/'.$file_name;

        $new_file_upload = isset($validated['file']);

        if (! $outline) {
            $outline = ExhibitOutlines::create([
                'exhibit_id' => $exhibit->exhibit_id,
                'outline_description' => $validated['outline_description'],
                'category' => $validated['category'],
            ]);
        } else {
            $outline->update([
                'outline_description' => $validated['outline_description'],
                'category' => $validated['category'],
            ]);
        }

        if ($new_file_upload) {
            if ($existing_file && Storage::disk('public')->exists($old_file_path)) {
                Storage::disk('public')->delete($old_file_path);
            }

            $validated['file']->storeAs('exhibits/'.$exhibit_name.'/'.$category_slug, $file_name, 'public');
            $activity = $existing_file ? ActivityLogAction::Update : ActivityLogAction::Upload;
        }

        if ($existing_file) {
            $exhibit_file = $existing_file;
        } else {
            $exhibit_file = new ExhibitFiles;
            $exhibit_file->exhibit_outline_id = $outline->exhibit_outline_id;
        }

        if ($new_file_upload) {
            $exhibit_file->file_name = $file_name;
            $exhibit_file->file_path = $file_path;
        } elseif ($existing_file) {
            if (Storage::disk('public')->exists($old_file_path) && $old_file_path !== $file_path) {
                if (Storage::disk('public')->move($old_file_path, $file_path)) {
                    $exhibit_file->file_name = $file_name;
                    $exhibit_file->file_path = $file_path;
                    $activity = ActivityLogAction::Update;
                } else {
                    $exhibit_file->file_name = $existing_file->file_name;
                    $exhibit_file->file_path = $old_file_path;
                }
            } else {
                $exhibit_file->file_name = $existing_file->file_name;
                $exhibit_file->file_path = $old_file_path;
            }
        }

        // <-- Add a fallback for updates without file change
        if (! $activity) {
            $activity = $outline ? ActivityLogAction::Update : ActivityLogAction::Upload;
        }

        if (! empty($exhibit_file->file_path)) {
            $exhibit_file->uploaded_by = $user->user_id;
            $exhibit_file->uploaded_at = now();
            $exhibit_file->file_status_id = $file_status;
            $exhibit_file->save();
        }

        ActivityLogService::fileManagementLog(
            userId: $user->user_id,
            activity: $activity,
            description: "{$activityLog->activity}d exhibit outline for '{$exhibit->exhibit_name}'.",
        );

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Exhibit Outline')
            ->with('message', 'The outline has been saved successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $outline = ExhibitOutlines::where('exhibit_outline_id', $request->outline_id)->first();
        $user = Auth::user();

        if ($outline) {
            $exhibit_file = $outline->ExhibitFiles;
            if ($exhibit_file && Storage::disk('public')->exists($exhibit_file->file_path)) {
                Storage::disk('public')->delete($exhibit_file->file_path);
                $exhibit_file->delete();
            }

            ActivityLogService::fileManagementLog(
                userId: $user->user_id,
                activity: ActivityLogAction::Delete,
                description: 'Deleted Exhibit Outline: '.$outline->outline_description,
            );

            $outline->delete();

            return redirect()->back()
                ->with('type', 'success')
                ->with('title', 'Success')
                ->with('message', 'Exhibit outline successfully deleted.');
        } else {
            return redirect()->back()
                ->with('type', 'error')
                ->with('title', 'Error')
                ->with('message', 'Exhibit outline not found.');
        }
    }
}

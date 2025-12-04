<?php

namespace App\Http\Controllers\Exhibits;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Exhibits;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\FileStatus;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class ExhibitFilesController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'exhibit_id' => ['required', 'integer', 'exists:exhibits,exhibit_id'],
            'file' => ['required', 'file', 'mimes:pdf'],
        ]);

        $user = Auth::user();

        $exhibit = Exhibits::with('ExhibitOutlines.ExhibitFiles')->findOrFail($validated['exhibit_id']);

        $outline = $exhibit->ExhibitOutlines->first();

        if (!$outline) {
            // Create the single outline for the exhibit
            $outline = $exhibit->ExhibitOutlines()->create([
                'outline_description' => $exhibit->exhibit_name,
                'category' => null,
            ]);
        }

        $exhibit_name = Str::slug($exhibit->exhibit_name, '_');
        $file_name = $exhibit_name . '.pdf';
        $file_path = "exhibits/{$exhibit_name}/{$file_name}";

        $existing_file = $outline->ExhibitFiles()->first();

        $activityLog = new ActivityLog();

        if ($existing_file && Storage::disk('public')->exists($existing_file->file_path)) {
            Storage::disk('public')->delete($existing_file->file_path);
            $existing_file->delete();
            $activityLog->activity = 'Update';
        } else {
            $activityLog->activity = 'Upload';
        }

        $uploadedFile = $validated['file'];
        Storage::disk('public')->putFileAs("exhibits/{$exhibit_name}", $uploadedFile, $file_name);

        $outline->ExhibitFiles()->create([
            'file_name' => $file_name,
            'file_path' => $file_path,
            'file_status_id' => FileStatus::where('status_name', 'Approved')->first()->file_status_id,
            'uploaded_by' => $user->user_id,
            'uploaded_at' => now(),
        ]);

        $activityLog->user_id = $user->user_id;
        $activityLog->description = "{$activityLog->activity}d exhibit file for '{$exhibit->exhibit_name}'.";
        $activityLog->type = 'Files';
        $activityLog->activity_date = now();
        $activityLog->save();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'File Uploaded')
            ->with('message', 'Exhibit file uploaded successfully.');
    }
}

<?php

namespace App\Http\Controllers\Exhibits;

use App\Enums\ActivityLogAction;
use App\Http\Controllers\Controller;
use App\Models\Exhibits;
use App\Models\FileStatus;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ExhibitFilesController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'exhibit_id' => ['required', 'integer', 'exists:exhibits,exhibit_id'],
            'file' => ['required', 'file', 'mimes:pdf'],
        ]);

        $user = Auth::user();

        $exhibit = Exhibits::with('ExhibitOutlines.ExhibitFiles')->findOrFail($validated['exhibit_id']);

        $outline = $exhibit->ExhibitOutlines->first();

        if (! $outline) {
            // Create the single outline for the exhibit
            $outline = $exhibit->ExhibitOutlines()->create([
                'outline_description' => $exhibit->exhibit_name,
                'category' => null,
            ]);
        }

        $exhibit_name = Str::slug($exhibit->exhibit_name, '_');
        $file_name = $exhibit_name.'.pdf';
        $file_path = "exhibits/{$exhibit_name}/{$file_name}";

        $existing_file = $outline->ExhibitFiles()->first();

        if ($existing_file && Storage::disk('s3')->exists($existing_file->file_path)) {
            Storage::disk('s3')->delete($existing_file->file_path);
            $existing_file->delete();
            $activity = ActivityLogAction::Update;
        } else {
            $activity = ActivityLogAction::Upload;
        }

        $uploadedFile = $validated['file'];
        Storage::disk('s3')->putFileAs("exhibits/{$exhibit_name}", $uploadedFile, $file_name);

        $outline->ExhibitFiles()->create([
            'file_name' => $file_name,
            'file_path' => $file_path,
            'file_status_id' => FileStatus::where('status_name', 'Approved')->first()->file_status_id,
            'uploaded_by' => $user->user_id,
            'uploaded_at' => now(),
        ]);

        ActivityLogService::fileManagementLog(
            userId: $user->user_id,
            activity: $activity,
            description: "{$activity->value}d exhibit file for '{$exhibit->exhibit_name}'.",
        );

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'File Uploaded')
            ->with('message', 'Exhibit file uploaded successfully.');
    }
}

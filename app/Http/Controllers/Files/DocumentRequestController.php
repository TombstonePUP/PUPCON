<?php

namespace App\Http\Controllers\Files;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\AreaFiles;
use App\Models\AreaForms;
use App\Models\ExhibitFiles;
use App\Models\FileStatus;
use App\Models\FilesOverview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class DocumentRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $files = null;
        if ($user->Roles->role_name === 'Admin' || $user->Roles->role_name === 'Coordinator') {
            $files = FilesOverview::select('*')->get();
        } else {
            $name = $user->first_name . ' ' . $user->last_name;
            $files = FilesOverview::where('uploaded_by', 'ILIKE', $name)->get();
        }
        $files->map(function ($file) {
            if ($file->file_path && $file->file_name) {
                $file->file_path = Storage::url(Crypt::decryptString($file->file_path));
                $file->file_name = Crypt::decryptString($file->file_name);
                return $file;
            }
            return $file;
        });

        return inertia('admin/document/document-request', [
            'files' => $files,
        ]);
    }

    /**
     * Approve the specified resource in storage.
     */
    public function approve(Request $request)
    {
        $validated = $request->validate([
            'file' => ['required', 'array'],
            'file.*.file_id' => ['required', 'integer'],
            'file.*.file_type' => ['required', 'string'],
        ]);

        $status_id = FileStatus::where('status_name', 'Approved')->first()->file_status_id;
        $user = Auth::user();

        foreach ($validated['file'] as $fileData) {
            $file = null;
            if ($fileData['file_type'] === 'exhibits') {
                $file = ExhibitFiles::findOrFail($fileData['file_id']);
            } elseif (preg_match('/area-forms/i', $fileData['file_type'])) {
                $file = AreaForms::findOrFail($fileData['file_id']);
            } elseif (preg_match('/area/i', $fileData['file_type'])) {
                $file = AreaFiles::findOrFail($fileData['file_id']);
            }

            if (!$file) {
                continue;
            }

            ActivityLog::create([
                'user_id' => $user->user_id,
                'activity' => 'Approve',
                'description' => "Approved file: {$file->file_name}",
                'type' => 'Files',
                'activity_date' => now(),
            ]);

            $file->file_status_id = $status_id;
            $file->file_rejection_reason = '';
            $file->save();
        }

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Success')
            ->with('message', 'File Approved Successfully');
    }

    /**
     * Reject the specified resource in storage.
     */
    public function reject(Request $request)
    {
        $validated = $request->validate([
            'file' => ['required', 'array'],
            'file.*.file_id' => ['required', 'integer'],
            'file.*.file_type' => ['required', 'string'],
            'file.*.rejection_reason' => ['required', 'string'],
        ]);


        $user = Auth::user();
        $status_id = FileStatus::where('status_name', 'Rejected')->first()->file_status_id;

        foreach ($validated['file'] as $fileData) {
            $file = null;
            if ($fileData['file_type'] === 'exhibits') {
                $file = ExhibitFiles::findOrFail($fileData['file_id']);
            } elseif (preg_match('/area-forms/i', $fileData['file_type'])) {
                $file = AreaForms::findOrFail($fileData['file_id']);
            } elseif (preg_match('/area/i', $fileData['file_type'])) {
                $file = AreaFiles::findOrFail($fileData['file_id']);
            }

            if (!$file) {
                continue;
            }

            ActivityLog::create([
                'user_id' => $user->user_id,
                'activity' => 'Reject',
                'description' => "Rejected file: {$file->file_name}. Reason: {$fileData['rejection_reason']}",
                'type' => 'Files',
                'activity_date' => now(),
            ]);

            $file->file_status_id = $status_id;
            $file->file_rejection_reason = $fileData['rejection_reason'];
            $file->save();
        }

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Success')
            ->with('message', 'File Rejected Successfully');
    }

    /**
     * Revert the specified resource in storage.
     */
    public function revert(Request $request)
    {
        $validated = $request->validate([
            'file' => ['required', 'array'],
            'file.*.file_id' => ['required', 'integer'],
            'file.*.file_type' => ['required', 'string'],
        ]);


        $status_id = FileStatus::where('status_name', 'Pending')->first()->file_status_id;
        $user = Auth::user();

        foreach ($validated['file'] as $fileData) {
            $file = null;
            if ($fileData['file_type'] === 'exhibits') {
                $file = ExhibitFiles::findOrFail($fileData['file_id']);
            } elseif (preg_match('/area-forms/i', $fileData['file_type'])) {
                $file = AreaForms::findOrFail($fileData['file_id']);
            } elseif (preg_match('/area/i', $fileData['file_type'])) {
                $file = AreaFiles::findOrFail($fileData['file_id']);
            }

            if (!$file) {
                continue;
            }

            ActivityLog::create([
                'user_id' => $user->user_id,
                'activity' => 'Revert',
                'description' => "Reverted file to pending status: {$file->file_name}",
                'type' => 'Files',
                'activity_date' => now(),
            ]);

            $file->file_status_id = $status_id;
            $file->file_rejection_reason = '';
            $file->save();
        }

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Success')
            ->with('message', 'File Reverted Successfully');
    }
}

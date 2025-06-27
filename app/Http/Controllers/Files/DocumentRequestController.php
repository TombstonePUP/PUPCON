<?php

namespace App\Http\Controllers\Files;

use App\Http\Controllers\Controller;
use App\Models\AreaFiles;
use App\Models\AreaForms;
use App\Models\ExhibitFiles;
use App\Models\FileStatus;
use App\Models\FilesOverview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;

class DocumentRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $filesOverview = FilesOverview::select('*')->get();
        $filesOverview->map(function ($file) {
            if ($file->file_path && $file->file_name) {
                $file->file_path = Storage::url(Crypt::decryptString($file->file_path));
                $file->file_name = Crypt::decryptString($file->file_name);
                return $file;
            }
            return $file;
        });

        return inertia('document/document-request', [
            'files' => $filesOverview,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function approve(Request $request)
    {
        $validated = $request->validate([
            'file_id' => 'required|integer',
            'file_type' => 'required|string'
        ]);

        $file = null;
        if ($validated['file_type'] === 'exhibits') {
            $file = ExhibitFiles::findOrFail($validated['file_id']);
        } elseif ($validated['file_type'] === 'area-forms') {
            $file = AreaForms::findOrFail($validated['file_id']);
        } elseif (substr($validated['file_type'], 0, 4) === 'Area') {
            $file = AreaFiles::findOrFail($validated['file_id']);
        };

        $file->file_status_id = FileStatus::where('status_name', 'Approved')->first()->file_status_id;
        $file->file_rejection_reason = '';
        $file->save();

        return redirect()->back()
            ->with('success', 'File Approved Successfully');

    }

    /**
     * Update the specified resource in storage.
     */
    public function reject(Request $request)
    {
        // dd($request->all());
        $validated = $request->validate([
            'file_id' => 'required|integer',
            'file_type' => 'required|string',
            'rejection_reason' => 'required|string',
        ]);

        $file = null;
        if ($validated['file_type'] === 'exhibits') {
            $file = ExhibitFiles::findOrFail($validated['file_id']);
        } elseif ($validated['file_type'] === 'area-forms') {
            $file = AreaForms::findOrFail($validated['file_id']);
        } elseif (substr($validated['file_type'], 0, 4) === 'Area') {
            $file = AreaFiles::findOrFail($validated['file_id']);
        };

        $file->file_status_id = FileStatus::where('status_name', 'Rejected')->first()->file_status_id;
        $file->file_rejection_reason = $validated['rejection_reason'];
        $file->save();

        return redirect()->back()
            ->with('success', 'File Approved Successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function revert(Request $request)
    {
        // dd($request->all());
        $validated = $request->validate([
            'file_id' => 'required|integer',
            'file_type' => 'required|string'
        ]);

        $file = null;

        if ($validated['file_type'] === 'exhibits') {
            $file = ExhibitFiles::findOrFail($validated['file_id']);
        } elseif ($validated['file_type'] === 'area-forms') {
            $file = AreaForms::findOrFail($validated['file_id']);
        } elseif (substr($validated['file_type'], 0, 4) === 'Area') {
            $file = AreaFiles::findOrFail($validated['file_id']);
        };

        $file->file_status_id = FileStatus::where('status_name', 'Pending')->first()->file_status_id;
        $file->file_rejection_reason = '';
        $file->save();

        return redirect()->back()
            ->with('success', 'File Approved Successfully');
    }
}

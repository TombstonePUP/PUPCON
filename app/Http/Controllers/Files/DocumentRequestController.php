<?php

namespace App\Http\Controllers\Files;

use App\Http\Controllers\Controller;
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
            $file->file_path = Storage::url(Crypt::decryptString($file->file_path));
            $file->file_name = Crypt::decryptString($file->file_name);
            return $file;
        });

        return inertia('document/document-request', [
            'files' => $filesOverview,
        ]);
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(FilesOverview $filesOverview)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FilesOverview $filesOverview)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FilesOverview $filesOverview)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FilesOverview $filesOverview)
    {
        //
    }
}

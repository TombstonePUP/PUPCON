<?php

namespace App\Http\Controllers\Parameters;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use League\Csv\Reader;


class ImportParametersController extends Controller
{
    public function download()
    {
        $filePath = public_path('/documents/import_parameter.csv');
        $headers = ['Content-Type' => 'text/csv'];
        $fileName = 'parameter_template.csv';
        return response()->download($filePath, $fileName, $headers);
    }

    public function import(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'document' => 'required|file|mimes:csv',
        ], [
            'document.mimes' => 'The document must be a file of type: xlsx, csv.',
            'document.required' => 'Please upload a document to import.',
        ]);

        $file = $validated['document'];
        // $csv = Reader::createFromPath($file->getRealPath(), 'r');
        // $csv->setHeaderOffset(0);

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Import Successful')
            ->with('message', 'Area parameters imported successfully.');
    }
}

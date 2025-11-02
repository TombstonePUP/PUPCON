<?php

namespace App\Http\Controllers\Parameters;

use App\Http\Controllers\Controller;
use App\Models\AreaParameters;
use App\Models\ParameterOutlineCategory;
use App\Models\ParameterOutlines;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use League\Csv\Reader;
use Illuminate\Support\Facades\DB;


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

        $area_id = $request->area_id;
        $file = $validated['document'];
        $path = $file->getRealPath();
        $csv = Reader::from($file->getRealPath(), 'r');
        $csv->setHeaderOffset(0);

        $records = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        DB::transaction(function () use ($records, $area_id) {
            $section = null;
            $headers = [];
            $parameters = [];

            foreach ($records as $record) {
                $record = trim($record);

                if (stripos($record, '#parameters') === 0) {
                    $section = 'parameters';
                    $headers = [];
                    continue;
                }

                if (stripos($record, '#benchmarks') === 0) {
                    $section = 'benchmarks';
                    $headers = [];
                    continue;
                }

                if (stripos($record, '--notes--') === 0) {
                    $section = null;
                    break;
                }

                $columns = str_getcsv($record);

                if (count(array_filter($columns, fn($value) => trim($value) !== '')) === 0) {
                    continue;
                }

                if (empty($headers) && in_array('id', $columns) || in_array('parameter_id', $columns)) {
                    $headers = $columns;
                    continue;
                }

                if ($section === 'parameters') {
                    $row = array_combine($headers, $columns);

                    $parameter = AreaParameters::create(
                        [
                            'area_id' => $area_id,
                            'parameter_name' => $row['parameter_name'],
                            'parameter_description' => $row['parameter_description'],
                        ]
                    );
                    $parameters[$row['id']] = $parameter->area_parameter_id;
                }

                if ($section === 'benchmarks') {
                    $row = array_combine($headers, $columns);

                    $parameter_id = $parameters[$row['parameter_id']];
                    $category = preg_replace('/[\x00-\x1F\x7F\xA0]/u', '', $row['benchmark_category']);
                    $category = trim($category);
                    $benchmark_category = ParameterOutlineCategory::where('category_name', $category)->first();
                    $category_id = $benchmark_category?->parameter_outline_category_id;

                    if ($parameter_id) {
                        ParameterOutlines::create(
                            [
                                'area_parameter_id' => $parameter_id,
                                'parameter_outline_category_id' => $category_id,
                                'outline_number' => $row['benchmark_number'],
                                'outline_description' => $row['benchmark_description'],
                                'container' => filter_var($row['benchmark_container'], FILTER_VALIDATE_BOOLEAN),
                            ]
                        );
                    }
                }
            }
        });

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Import Successful')
            ->with('message', 'Area parameters imported successfully.');
    }
}

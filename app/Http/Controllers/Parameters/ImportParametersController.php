<?php

namespace App\Http\Controllers\Parameters;

use App\Enums\ActivityLogAction;
use App\Http\Controllers\Controller;
use App\Models\AccreditationLevels;
use App\Models\Areas;
use App\Models\ParameterOutlineCategory;
use App\Models\ParameterOutlines;
use App\Models\Programs;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use League\Csv\Reader;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ImportParametersController extends Controller
{
    public function download(): BinaryFileResponse
    {
        $filePath = public_path('/documents/import_parameter.csv');
        $headers = ['Content-Type' => 'text/csv'];
        $fileName = 'parameter_template.csv';

        return response()->download($filePath, $fileName, $headers);
    }

    public function import(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'document' => 'required|file|mimes:csv,txt',
        ], [
            'document.mimes' => 'The document must be a CSV file.',
            'document.required' => 'Please upload a document to import.',
        ]);

        $user = Auth::user();
        $program = Programs::with('Levels')->findOrFail($request->program_id);

        $area = $request->area_id;
        $area = Areas::findOrFail($area);
        $level = AccreditationLevels::find($request->level_id);
        $file = $validated['document'];
        $path = $file->getRealPath();
        $csv = Reader::from($file->getRealPath(), 'r');
        $csv->setHeaderOffset(0);

        $records = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        DB::transaction(function () use ($records, $area, $level, $program, $user) {
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

                if (count(array_filter($columns, fn ($value) => trim($value) !== '')) === 0) {
                    continue;
                }

                if (empty($headers) && in_array('parameter', $columns)) {
                    $headers = $columns;

                    continue;
                }

                if ($section === 'parameters') {
                    $row = array_combine($headers, $columns);

                    $parameter = $area->AreaParameters()->create(
                        [
                            // 'area_id' => $area_id,
                            'parameter_name' => $row['parameter'],
                            'parameter_description' => $row['parameter_description'],
                        ]
                    );
                    $parameters[$row['parameter']] = $parameter->area_parameter_id;
                    ActivityLogService::contentManagementLog(
                        userId: $user->user_id,
                        activity: ActivityLogAction::Import,
                        description: "Imported parameter
                            '{$row['parameter']}' for area
                            '{$area->area_name}' in program
                            '{$program->program_name}'-'{$level?->level}'.",
                    );
                }

                if ($section === 'benchmarks') {
                    $row = array_combine($headers, $columns);

                    $parameter = $parameters[$row['parameter']];
                    $category = $row['benchmark_category'];
                    $benchmark_category = ParameterOutlineCategory::where('category_name', $category)->first();
                    $category_id = $benchmark_category?->parameter_outline_category_id;

                    if ($parameter) {
                        ParameterOutlines::create(
                            [
                                'area_parameter_id' => $parameter,
                                'parameter_outline_category_id' => $category_id,
                                'outline_number' => $row['benchmark_number'],
                                'outline_description' => $row['benchmark_description'],
                                'container' => filter_var($row['benchmark_container'], FILTER_VALIDATE_BOOLEAN),
                            ]
                        );
                        ActivityLogService::contentManagementLog(
                            userId: $user->user_id,
                            activity: ActivityLogAction::Import,
                            description: "Imported benchmark
                                '{$row['benchmark_number']}' for parameter
                                '{$row['parameter']}' in area
                                '{$area->area_name}' in program
                                '{$program->program_name}'-'{$level?->level}'.",
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

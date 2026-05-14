<?php

namespace App\Http\Controllers\Parameters;

use App\Enums\ActivityLogAction;
use App\Http\Controllers\Controller;
use App\Models\AccreditationLevels;
use App\Models\ActivityLog;
use App\Models\AreaParameters;
use App\Models\Programs;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AreaParameterController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'area_id' => 'required|integer',
            'parameter_name' => 'nullable|string|max:1',
            'parameter_description' => 'string|max:1000',
        ]);
        $validated['parameter_name'] = strtoupper($validated['parameter_name'] ?? '');

        $areaParameter = new AreaParameters;
        $areaParameter->create($validated);

        $user = Auth::user();

        ActivityLog::create([
            'user_id' => $user->user_id,
            'description' => 'Created a new Area Parameter: '.$validated['parameter_name'].$validated['parameter_description'],
            'activity' => 'Create',
            'type' => 'Content',
            'activity_date' => now(),
        ]);

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Creation Successful')
            ->with('message', 'A new Area Parameter has been added.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'area_id' => ['required', 'integer'],
            'area_parameter_id' => ['required', 'integer'],
            'parameter_name' => ['nullable', 'string', 'max:1'],
            'parameter_description' => ['required', 'string', 'max:1000'],
        ]);

        $validated['parameter_name'] = strtoupper($validated['parameter_name'] ?? '');

        // Get the AreaParameter
        $parameter = AreaParameters::with([
            'Areas.Levels.Programs',
            'ParameterOutlines.AreaFiles',
            'ParameterOutlines.ParameterOutlineCategory',
        ])->findOrFail($validated['area_parameter_id']);

        $area = $parameter->Areas;
        $level = AccreditationLevels::where('accreditation_level_id', $request->level_id)->first();
        $program = Programs::findOrFail($request->program_id);

        // Determine level folder (same logic as your Area update)
        $level_name = $level->level === 0 ? 'psv' : 'level_'.$level->level;

        // Base path without parameter yet
        $degree_type = Str::slug($program->degree_type, '_');
        $program_name = Str::slug($program->program_name, '_');
        $program_folder = "{$degree_type}/{$program_name}";
        $area_folder = Str::slug($area->area_name, '_');

        // Old + New parameter folders
        $old_param_folder = Str::slug($parameter->parameter_name, '_');
        $new_param_folder = Str::slug($validated['parameter_name'], '_');

        // Disk
        $disk = Storage::disk('public');

        /**
         * MOVE ALL FILES UNDER:
         * documents/{program}/{level}/{area}/{parameter}/{category}
         */
        foreach ($parameter->ParameterOutlines as $outline) {

            if (! $outline->AreaFiles) {
                continue;
            }

            $file = $outline->AreaFiles;

            $category_folder = Str::slug($outline->ParameterOutlineCategory->category_name, '_');

            $old_path = "documents/{$program_folder}/{$level_name}/{$area_folder}/{$old_param_folder}/{$category_folder}/".basename($file->file_path);
            $new_path = "documents/{$program_folder}/{$level_name}/{$area_folder}/{$new_param_folder}/{$category_folder}/".basename($file->file_path);

            // Ensure folder exists
            $disk->makeDirectory("documents/{$program_folder}/{$level_name}/{$area_folder}/{$new_param_folder}/{$category_folder}");

            if ($disk->exists($old_path)) {
                $disk->move($old_path, $new_path);
            }

            // Update DB file_path
            $file->update(['file_path' => $new_path]);
        }

        /**
         * UPDATE PARAMETER NAME & DESCRIPTION
         */
        $parameter->update([
            'parameter_name' => $validated['parameter_name'],
            'parameter_description' => $validated['parameter_description'],
        ]);

        /**
         * LOG
         */
        $user = Auth::user();
        ActivityLog::create([
            'user_id' => $user->user_id,
            'description' => 'Updated Area Parameter "'.$parameter->parameter_name.'" in '
                .$program->program_name.' - '.$level_name,
            'activity' => 'Update',
            'type' => 'Content',
            'activity_date' => now(),
        ]);

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Update Successful')
            ->with('message', 'The Area Parameter has been updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, AreaParameters $areaParameters): RedirectResponse
    {
        $parameter = $areaParameters->find($request->parameter_id);

        $name = $parameter->parameter_name;
        $description = $parameter->parameter_description;
        $parameter->load('ParameterOutlines.AreaFiles', 'ParameterOutlines.AreaParameter.Areas');

        $parameter->ParameterOutlines->map(function ($outline) {
            if ($outline->AreaFiles) {
                if (Storage::disk('public')->exists($outline->AreaFiles->file_path)) {
                    Storage::disk('public')->delete($outline->AreaFiles->file_path);
                }
                ActivityLog::create([
                    'user_id' => Auth::user()->user_id,
                    'description' => 'Deleted Benchmark File: '.$outline->AreaFiles->file_name.'from Area: '.$outline->AreaParameter->Areas->area_name,
                    'activity' => 'Delete',
                    'type' => 'Files',
                    'activity_date' => now(),
                ]);
            }
        });

        $parameter->delete();

        $user = Auth::user();

        ActivityLogService::contentManagementLog(
            userId: $user->user_id,
            activity: ActivityLogAction::Delete,
            description: 'Deleted Area Parameter: '.$name.$description
        );

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Delete Successful')
            ->with('message', 'The Area Parameter has been deleted.');
    }
}

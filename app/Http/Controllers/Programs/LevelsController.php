<?php

namespace App\Http\Controllers\Programs;

use App\Enums\ActivityLogAction;
use App\Http\Controllers\Controller;
use App\Models\Programs;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LevelsController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @return RedirectResponse
     */
    public function store(Request $request)
    {
        $program = Programs::find($request->program_id);
        $level = isset($program->latestlevel->level)
            ? $program->latestlevel->level
            : null;

        $min = $level ?? 0;
        $max = $level !== null ? $level + 1 : 0;

        $user = Auth::user();

        $validated = $request->validate([
            'program_name' => ['required', 'string'],
            'new_level' => [
                'required',
                'integer',
                "min:$min",
                "max:$max",
            ],
        ], [
            'program_name.required' => 'Program is required.',
            'program_name.string' => 'Program must be a string.',
            'program_name.max' => 'Program must not exceed 255 characters.',
            'new_level.required' => 'Level is required.',
            'new_level.integer' => 'Level must be an integer.',
            'new_level.min' => "Level must be at least Level $min.",
            'new_level.max' => "Level must not exceed Level $max.",
        ]);

        $program->update([
            'under_survey' => true,
        ]);
        $program = $program->Levels()->create([
            'program_id' => $program->program_id,
            'level' => $validated['new_level'],
            'survey_date' => now(),
            'remarks' => 'Ongoing Survey',
            'is_active' => true,
        ]);

        $level = $program->level === 0 ? 'Preliminary Survey' : 'Level '.$program->level;

        ActivityLogService::contentManagementLog(
            activity: ActivityLogAction::Create,
            userId: $user->user_id,
            description: 'Added a new level: '.$level.' to program: '.$validated['program_name'],
        );

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Level Added')
            ->with('message', 'Level "'.$level.'" has been added successfully to program.');
    }

    /**
     * Update the specified resource in storage.
     *
     * @return RedirectResponse
     */
    public function update(Request $request, Programs $programs)
    {
        $validated = $request->validate(
            [
                'program_name' => ['required', 'string'],
                'accreditation_level_id' => ['required', 'integer'],
                'remarks' => ['required', 'string'],
                'is_active' => ['required', 'boolean'],
            ],
            [
                'program_name.required' => 'Program is required.',
                'program_name.string' => 'Program must be a string.',
                'program_name.max' => 'Program must not exceed 255 characters.',
                'accreditation_level_id.required' => 'Level is required.',
                'accreditation_level_id.integer' => 'Level must be an integer.',
                'remarks.required' => 'Remarks is required.',
                'remarks.string' => 'Remarks must be a string.',
                'remarks.max' => 'Remarks must not exceed 255 characters.',
            ]
        );

        $user = Auth::user();
        $program = $programs->find($request->program_id);
        $level = $program->levels()->where('accreditation_level_id', $validated['accreditation_level_id'])->first();

        $program->update([
            'under_survey' => false,
        ]);

        $level->update([
            'remarks' => $validated['remarks'],
            'is_active' => $validated['is_active'],
        ]);

        $level->Areas()->update(['archive' => true]);

        ActivityLogService::contentManagementLog(
            activity: ActivityLogAction::Update,
            userId: $user->user_id,
            description: 'Updated level: '.($level->level === 0 ? 'Preliminary Survey' : 'Level '.$level->level).
                ' for program: '.$validated['program_name'],
        );

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Level Updated')
            ->with('message', 'Level has been updated successfully for program.');
    }
}

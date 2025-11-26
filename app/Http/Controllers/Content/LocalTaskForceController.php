<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;
use App\Models\ContentPages;
use App\Models\LocalTaskForce;
use Illuminate\Http\Request;

class LocalTaskForceController extends Controller
{
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'page' => ['required', 'array'],
            'chairmen' => ['nullable', 'array'],
            'page.content_page_id' => ['required', 'integer'],
            'page.page' => ['required', 'string'],
            'page.title' => ['required', 'string'],
            'page.description' => ['required', 'string'],
            'chairmen.*.local_task_force_id' => ['nullable', 'integer'],
            'chairmen.*.area_name' => ['nullable', 'string'],
            'chairmen.*.first_name' => ['required', 'string'],
            'chairmen.*.last_name' => ['required', 'string'],
            'chairmen.*.official' => ['required', 'boolean'],
            'chairmen.*.official_position' => ['nullable', 'string'],
            'chairmen.*.profile_image' => ['nullable', 'file', 'image', 'mimes:jpeg,jpg,png', 'max:2048'],
            'chairmen.*.members' => ['nullable', 'array'],
            'chairmen.*.members.*.local_task_force_id' => ['required', 'integer'],
            'chairmen.*.members.*.member_id' => ['required', 'integer'],
            'chairmen.*.members.*.full_name' => ['required', 'string'],
            'chairmen.*.members.*.role' => ['required', 'string'],
        ]);

        $page = ContentPages::find($validated['page']['content_page_id']);
        if ($page) {
            $page->title = $validated['page']['title'];
            $page->description = $validated['page']['description'];
            $page->save();
        } else {
            $page = ContentPages::create([
                'page' => $validated['page']['page'],
                'title' => $validated['page']['title'],
                'description' => $validated['page']['description'],
            ]);
        }

        $task_force_ids = [];
        foreach ($validated['chairmen'] as $chairmanData) {
            $profileImagePath = null;
            $profileImageName = null;
            $chairman = null;
            if (isset($chairmanData['profile_image'])) {
                $profileImageName = $chairmanData['first_name'] . '-' . $chairmanData['last_name'] . '-profile.' . $chairmanData['profile_image']->getClientOriginalExtension();
                $profileImagePath = 'local-task-force/' . $profileImageName;
                $chairmanData['profile_image']->storeAs('local-task-force', $profileImageName, 'public');
            }

            if ($chairman = LocalTaskForce::find($chairmanData['local_task_force_id'])) {
                $chairman->update([
                    'area_name' => $chairmanData['area_name'] ?? $chairman->area_name,
                    'first_name' => $chairmanData['first_name'],
                    'last_name' => $chairmanData['last_name'],
                    'official' => $chairmanData['official'],
                    'official_position' => $chairmanData['official_position'] ?? $chairman->official_position,
                    'profile_image_name' => $profileImageName ?? $chairman->profile_image_name,
                    'profile_image_path' => $profileImagePath ?? $chairman->profile_image_path
                ]);
                $task_force_ids[] = $chairman->local_task_force_id;
            } else {
                $chairman = LocalTaskForce::create([
                    'area_name' => $chairmanData['area_name'] ?? null,
                    'first_name' => $chairmanData['first_name'],
                    'last_name' => $chairmanData['last_name'],
                    'official' => $chairmanData['official'],
                    'official_position' => $chairmanData['official_position'] ?? null,
                    'profile_image_name' => $profileImageName ?? null,
                    'profile_image_path' => $profileImagePath ?? null
                ]);
                $task_force_ids[] = $chairman->local_task_force_id;
            }

            if (isset($chairmanData['members'])) {
                $member_ids = [];
                foreach ($chairmanData['members'] as $memberData) {
                    if ($member = $chairman->Members()->where('member_id', $memberData['member_id'])->first()) {
                        $member->update([
                            'full_name' => $memberData['full_name'],
                            'role' => $memberData['role'],
                        ]);
                        $member_ids[] = $member->member_id;
                    } else {
                        $member = $chairman->Members()->create([
                            // 'local_task_force_id' => $chairman->local_task_force_id,
                            'full_name' => $memberData['full_name'],
                            'role' => $memberData['role'],
                        ]);
                        $member_ids[] = $member->member_id;
                    }
                };
                $chairman->Members()->whereNotIn('member_id', $member_ids)->delete();
            }
        };
        LocalTaskForce::whereNotIn('local_task_force_id', $task_force_ids)->delete();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Update Successful')
            ->with('message', 'Local Task Force page updated successfully.');
    }
}

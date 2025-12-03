<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;
use App\Models\ContentPages;
use App\Models\LocalTaskForce;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class LocalTaskForceController extends Controller
{
    public function __invoke(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'page' => ['required', 'array'],
                'chairmen' => ['nullable', 'array'],
                'page.content_page_id' => ['required', 'integer'],
                'page.page' => ['required', 'string'],
                'page.title' => ['required', 'string'],
                'page.description' => ['required', 'string'],
                'chairmen.*.local_task_force_id' => ['nullable', 'integer'],
                'chairmen.*.area_name' => [
                    'required_if:chairmen.*.official,false',
                    'nullable',
                    'string',
                ],
                'chairmen.*.first_name' => ['required', 'string'],
                'chairmen.*.last_name' => ['required', 'string'],
                'chairmen.*.official' => ['required', 'boolean'],
                'chairmen.*.official_position' => [
                    'required_if:chairmen.*.official,true',
                    'nullable',
                    'string'
                ],
                'chairmen.*.profile_image' => ['nullable', 'file', 'image', 'mimes:jpeg,jpg,png', 'max:20480'],
                'chairmen.*.previewUrl' => ['nullable', 'string'],
                'chairmen.*.members' => ['nullable', 'array'],
                'chairmen.*.members.*.local_task_force_id' => ['nullable', 'integer'],
                'chairmen.*.members.*.member_id' => ['required', 'integer'],
                'chairmen.*.members.*.full_name' => ['required', 'string'],
                'chairmen.*.members.*.role' => ['required', 'string'],
            ],
            [
                'page.required' => 'The page data is required.',
                'page.array' => 'The page data must be an array.',
                'chairmen.array' => 'The chairmen data must be an array.',
                'page.content_page_id.required' => 'The content page ID is required.',
                'page.content_page_id.integer' => 'The content page ID must be an integer.',
                'page.page.required' => 'The page identifier is required.',
                'page.title.required' => 'The page title is required.',
                'page.description.required' => 'The page description is required.',
                'chairmen.*.area_name.required_if' => 'The area name is required for chairman.',
                'chairmen.*.first_name.required' => 'The first name is required.',
                'chairmen.*.last_name.required' => 'The last name is required.',
                'chairmen.*.official.required' => 'The official status is required.',
                'chairmen.*.official.boolean' => 'The official status must be true or false.',
                'chairmen.*.official_position.required_if' => 'The official position is required for official.',
                'chairmen.*.members.array' => 'The members data must be an array.',
                'chairmen.*.members.*.member_id.required' => 'The member ID is required.',
                'chairmen.*.members.*.full_name.required' => 'The member full name is required.',
                'chairmen.*.members.*.role.required' => 'The member role is required.',
                'chairmen.*.profile_image.image' => 'The profile image must be an image.',
                'chairmen.*.profile_image.mimes' => 'The profile image must be a file of type: jpeg, jpg, png.',
                'chairmen.*.profile_image.max' => 'The profile image may not be greater than 20MB.',
            ]
        );

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator) // sends validation errors to Inertia
                ->with('type', 'error')
                ->with('title', 'Validation Error')
                ->with('message', 'Please review all fields and try again.');
        }

        $validated = $validator->validated();

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
            // Fetch existing chairman (if it exists)
            $chairman = LocalTaskForce::find($chairmanData['local_task_force_id'] ?? 0);

            // Determine image values
            $profileImageName = $chairman ? $chairman->profile_image_name : null;
            $profileImagePath = $chairman ? $chairman->profile_image_path : null;

            // Handle image removal
            if ($chairman && empty($chairmanData['profile_image']) && empty($chairmanData['previewUrl'])) {
                if ($profileImagePath && Storage::disk('public')->exists($profileImagePath)) {
                    Storage::disk('public')->delete($profileImagePath);
                }
                $profileImageName = null;
                $profileImagePath = null;
            }
            // Handle new image upload
            if (!empty($chairmanData['profile_image'])) {
                // Delete old image from storage if exists
                if ($profileImagePath && Storage::disk('public')->exists($profileImagePath)) {
                    Storage::disk('public')->delete($profileImagePath);
                }

                $profileImageName = $chairmanData['first_name'] . '-' . $chairmanData['last_name'] . '-profile.' .
                    $chairmanData['profile_image']->getClientOriginalExtension();
                $profileImagePath = 'local-task-force/' . $profileImageName;
                $chairmanData['profile_image']->storeAs('local-task-force', $profileImageName, 'public');
            }

            // Update or create the record
            if ($chairman) {
                $chairman->update([
                    'area_name' => $chairmanData['area_name'] ?? $chairman->area_name,
                    'first_name' => $chairmanData['first_name'],
                    'last_name' => $chairmanData['last_name'],
                    'official' => $chairmanData['official'],
                    'official_position' => $chairmanData['official_position'] ?? $chairman->official_position,
                    'profile_image_name' => $profileImageName,
                    'profile_image_path' => $profileImagePath,
                ]);
                $task_force_ids[] = $chairman->local_task_force_id;
            } else {
                $chairman = LocalTaskForce::create([
                    'area_name' => $chairmanData['area_name'] ?? null,
                    'first_name' => $chairmanData['first_name'],
                    'last_name' => $chairmanData['last_name'],
                    'official' => $chairmanData['official'],
                    'official_position' => $chairmanData['official_position'] ?? null,
                    'profile_image_name' => $profileImageName,
                    'profile_image_path' => $profileImagePath,
                ]);
                $task_force_ids[] = $chairman->local_task_force_id;
            }

            // handle members
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

        // Delete Local Task Force records that are not in the request
        $chairmenToDelete = LocalTaskForce::whereNotIn('local_task_force_id', $task_force_ids)->get();
        foreach ($chairmenToDelete as $chairman) {
            if ($chairman->profile_image_path && Storage::disk('public')->exists($chairman->profile_image_path)) {
                Storage::disk('public')->delete($chairman->profile_image_path);
            }

            $chairman->delete();
        }
        LocalTaskForce::whereNotIn('local_task_force_id', $task_force_ids)->delete();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Update Successful')
            ->with('message', 'Local Task Force page updated successfully.');
    }
}

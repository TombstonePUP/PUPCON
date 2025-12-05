<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;
use App\Models\CampusGoals;
use Illuminate\Http\Request;
use App\Models\ContentPages;
use App\Models\PillarItems;
use App\Models\Pillars;
use App\Models\Vmgo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\ActivityLog;

class VmgoController extends Controller
{
    public function __invoke(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'page' => ['required', 'array'],
                'campus_goals' => ['nullable', 'array'],
                'pillars' => ['nullable', 'array'],
                'vmgo' => ['nullable', 'array'],
                'page.content_page_id' => ['nullable', 'integer'],
                'page.page' => ['required', 'string'],
                'page.title' => ['required', 'string'],
                'page.description' => ['required', 'string'],
                'page.video_link' => ['nullable', 'string'],
                'page.video_title' => ['nullable', 'string'],
                'page.video_description' => ['nullable', 'string'],
                'campus_goals.*.goal_id' => ['required', 'integer'],
                'campus_goals.*.goal_title_eng' => ['required', 'string'],
                'campus_goals.*.goal_desc_eng' => ['required', 'string'],
                'campus_goals.*.goal_title_fil' => ['required', 'string'],
                'campus_goals.*.goal_desc_fil' => ['required', 'string'],
                'pillars.*.pillar_id' => ['required', 'integer'],
                'pillars.*.pillar_title' => ['required', 'string'],
                'pillars.*.pillar_items' => ['nullable', 'array'],
                'pillars.*.pillar_items.*.item_id' => ['required', 'integer'],
                'pillars.*.pillar_items.*.pillar_id' => ['required', 'integer'],
                'pillars.*.pillar_items.*.item_description' => ['required', 'string'],
                'vmgo.vmgo_id' => ['required', 'integer'],
                'vmgo.vision' => ['required', 'string'],
                'vmgo.mission' => ['required', 'string'],
            ],
            [
                'page.content_page_id.required' => 'The page content ID is required.',
                'page.page.required' => 'The page identifier is required.',
                'page.title.required' => 'The page title is required.',
                'page.description.required' => 'The page description is required.',
                'campus_goals.*.goal_title_eng.required' => 'The campus goal title in English is required.',
                'campus_goals.*.goal_desc_eng.required' => 'The campus goal description in English is required.',
                'campus_goals.*.goal_title_fil.required' => 'The campus goal title in Filipino is required.',
                'campus_goals.*.goal_desc_fil.required' => 'The campus goal description in Filipino is required.',
                'pillars.*.pillar_title.required' => 'The pillar title is required.',
                'pillars.*.pillar_items.*.item_description.required' => 'The pillar item description is required.',
                'vmgo.vision.required' => 'The vision is required.',
                'vmgo.mission.required' => 'The mission is required.',
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

        $user = Auth::user();

        $page = ContentPages::find($validated['page']['content_page_id']);
        if ($page) {
            $page->page = $validated['page']['page'];
            $page->title = $validated['page']['title'];
            $page->description = $validated['page']['description'];
            $page->video_link = $validated['page']['video_link'] ?? null;
            $page->video_title = $validated['page']['video_title'] ?? null;
            $page->video_description = $validated['page']['video_description'] ?? null;
            $page->save();
        } else {
            $page = ContentPages::create([
                'page' => $validated['page']['page'],
                'title' => $validated['page']['title'],
                'description' => $validated['page']['description'],
                'video_link' => $validated['page']['video_link'] ?? null,
                'video_title' => $validated['page']['video_title'] ?? null,
                'video_description' => $validated['page']['video_description'] ?? null,
            ]);
        }

        ActivityLog::create([
            'user_id' => $user->user_id,
            'description' => 'Updated VMGO Content Page',
            'activity' => 'Update',
            'type' => 'Content',
            'activity_date' => now(),
        ]);

        $vmgo = Vmgo::find($validated['vmgo']['vmgo_id']);
        if ($vmgo) {
            $vmgo->vision = $validated['vmgo']['vision'];
            $vmgo->mission = $validated['vmgo']['mission'];
            $vmgo->save();
            ActivityLog::create([
                'user_id' => $user->user_id,
                'description' => 'Updated VMGO Vision and Mission',
                'activity' => 'Update',
                'type' => 'Content',
                'activity_date' => now(),
            ]);
        } else {
            Vmgo::create([
                'vision' => $validated['vmgo']['vision'],
                'mission' => $validated['vmgo']['mission'],
            ]);
            ActivityLog::create([
                'user_id' => $user->user_id,
                'description' => 'Created VMGO Vision and Mission',
                'activity' => 'Create',
                'type' => 'Content',
                'activity_date' => now(),
            ]);
        }

        $pillar_ids = [];
        $goal_ids = [];
        $pillar_items_ids = [];
        foreach ($validated['pillars'] as $pillarData) {
            $pillar = Pillars::find($pillarData['pillar_id']);
            if ($pillar) {
                $pillar->pillar_title = $pillarData['pillar_title'];
                $pillar->save();
                ActivityLog::create([
                    'user_id' => $user->user_id,
                    'description' => 'Updated Pillar: ' . $pillar->pillar_title,
                    'activity' => 'Update',
                    'type' => 'Content',
                    'activity_date' => now(),
                ]);
            } else {
                $pillar = Pillars::create([
                    'pillar_title' => $pillarData['pillar_title'],
                ]);
                ActivityLog::create([
                    'user_id' => $user->user_id,
                    'description' => 'Created Pillar: ' . $pillar->pillar_title,
                    'activity' => 'Create',
                    'type' => 'Content',
                    'activity_date' => now(),
                ]);
            }
            $pillar_ids[] = $pillar->pillar_id;
            foreach ($pillarData['pillar_items'] as $itemData) {
                $item = PillarItems::find($itemData['item_id']);
                if ($item) {
                    $item->pillar_id = $pillar->pillar_id;
                    $item->item_description = $itemData['item_description'];
                    $item->save();
                    $pillar_items_ids[] = $item->item_id;
                    ActivityLog::create([
                        'user_id' => $user->user_id,
                        'description' => 'Updated Pillar Item: ' . $item->item_description,
                        'activity' => 'Update',
                        'type' => 'Content',
                        'activity_date' => now(),
                    ]);
                } else {
                    $item = PillarItems::create([
                        'pillar_id' => $pillar->pillar_id,
                        'item_description' => $itemData['item_description'],
                    ]);
                    ActivityLog::create([
                        'user_id' => $user->user_id,
                        'description' => 'Created Pillar Item: ' . $item->item_description,
                        'activity' => 'Create',
                        'type' => 'Content',
                        'activity_date' => now(),
                    ]);

                    $pillar_items_ids[] = $item->item_id;
                }
            }
        }
        PillarItems::whereNotIn('item_id', $pillar_items_ids)->delete();
        Pillars::whereNotIn('pillar_id', $pillar_ids)->with('PillarItems')->delete();

        foreach ($validated['campus_goals'] as $goalData) {
            $goal = CampusGoals::find($goalData['goal_id']);
            if ($goal) {
                $goal->goal_title_eng = $goalData['goal_title_eng'];
                $goal->goal_desc_eng = $goalData['goal_desc_eng'];
                $goal->goal_title_fil = $goalData['goal_title_fil'];
                $goal->goal_desc_fil = $goalData['goal_desc_fil'];
                $goal->save();
                ActivityLog::create([
                    'user_id' => $user->user_id,
                    'description' => 'Updated Campus Goal: ' . $goal->goal_title_eng,
                    'activity' => 'Update',
                    'type' => 'Content',
                    'activity_date' => now(),
                ]);
            } else {
                $goal = CampusGoals::create([
                    'goal_title_eng' => $goalData['goal_title_eng'],
                    'goal_desc_eng' => $goalData['goal_desc_eng'],
                    'goal_title_fil' => $goalData['goal_title_fil'],
                    'goal_desc_fil' => $goalData['goal_desc_fil'],
                ]);
                ActivityLog::create([
                    'user_id' => $user->user_id,
                    'description' => 'Created Campus Goal: ' . $goal->goal_title_eng,
                    'activity' => 'Create',
                    'type' => 'Content',
                    'activity_date' => now(),
                ]);
            }
            $goal_ids[] = $goal->goal_id;
        }
        CampusGoals::whereNotIn('goal_id', $goal_ids)->delete();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Update Successful')
            ->with('message', 'The VMGO page has been updated successfully.');
    }
}

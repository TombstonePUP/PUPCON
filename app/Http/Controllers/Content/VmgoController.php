<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;
use App\Models\CampusGoals;
use Illuminate\Http\Request;
use App\Models\ContentPages;
use App\Models\PillarItems;
use App\Models\Pillars;
use App\Models\Vmgo;
use Illuminate\Support\Facades\Validator;

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
                'vmgo.avp_link' => ['nullable', 'string'],
                'vmgo.avp_title' => ['nullable', 'string'],
                'vmgo.avp_description' => ['nullable', 'string'],
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

        $page = ContentPages::find($validated['page']['content_page_id']);
        if ($page) {
            $page->page = $validated['page']['page'];
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

        $vmgo = Vmgo::find($validated['vmgo']['vmgo_id']);
        if ($vmgo) {
            $vmgo->vision = $validated['vmgo']['vision'];
            $vmgo->mission = $validated['vmgo']['mission'];
            $vmgo->avp_link = $validated['vmgo']['avp_link'] ?? null;
            $vmgo->avp_title = $validated['vmgo']['avp_title'] ?? null;
            $vmgo->avp_description = $validated['vmgo']['avp_description'] ?? null;
            $vmgo->save();
        } else {
            Vmgo::create([
                'vision' => $validated['vmgo']['vision'],
                'mission' => $validated['vmgo']['mission'],
                'avp_link' => $validated['vmgo']['avp_link'] ?? null,
                'avp_title' => $validated['vmgo']['avp_title'] ?? null,
                'avp_description' => $validated['vmgo']['avp_description'] ?? null,
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
            } else {
                $pillar = Pillars::create([
                    'pillar_title' => $pillarData['pillar_title'],
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
                } else {
                    $item = PillarItems::create([
                        'pillar_id' => $pillar->pillar_id,
                        'item_description' => $itemData['item_description'],
                    ]);

                    $pillar_items_ids[] = $item->item_id;
                }
            }
        }
        Pillars::whereNotIn('pillar_id', $pillar_ids)->with('PillarItems')->delete();
        PillarItems::whereNotIn('item_id', $pillar_items_ids)->delete();

        foreach ($validated['campus_goals'] as $goalData) {
            $goal = CampusGoals::find($goalData['goal_id']);
            if ($goal) {
                $goal->goal_title_eng = $goalData['goal_title_eng'];
                $goal->goal_desc_eng = $goalData['goal_desc_eng'];
                $goal->goal_title_fil = $goalData['goal_title_fil'];
                $goal->goal_desc_fil = $goalData['goal_desc_fil'];
                $goal->save();
            } else {
                $goal = CampusGoals::create([
                    'goal_title_eng' => $goalData['goal_title_eng'],
                    'goal_desc_eng' => $goalData['goal_desc_eng'],
                    'goal_title_fil' => $goalData['goal_title_fil'],
                    'goal_desc_fil' => $goalData['goal_desc_fil'],
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

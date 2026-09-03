<?php

namespace App\Http\Controllers\Content;

use App\Enums\ActivityLogAction;
use App\Http\Controllers\Controller;
use App\Models\ContentPages;
use App\Models\Facilities;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class FacilitiesController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'page' => ['required', 'array'],
            'facilities' => ['nullable', 'array'],
            'page.page' => ['required', 'string'],
            'page.content_page_id' => ['nullable', 'integer'],
            'page.title' => ['required', 'string'],
            'page.description' => ['required', 'string'],
            'facilities.*.facility_id' => ['required', 'integer'],
            'facilities.*.facility_name' => ['required', 'string'],
            'facilities.*.description' => ['required', 'string'],
            'facilities.*.facility_image' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg', 'max:20480'],
            'facilities.*.previewUrl' => ['nullable', 'string'],
        ], [
            'page.content_page_id.required' => 'The page content ID is required.',
            'page.title.required' => 'The page title is required.',
            'page.description.required' => 'The page description is required.',
            'page.page.required' => 'The page identifier is required.',
            'facilities.*.facility_name.required' => 'The facility name is required.',
            'facilities.*.description.required' => 'The facility description is required.',
            'facilities.*.facility_image.image' => 'The facility image must be an image file.',
            'facilities.*.facility_image.mimes' => 'The facility image must be a file of type: jpeg, png, jpg.',
            'facilities.*.facility_image.max' => 'The facility image may not be greater than 20MB.',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator) // sends validation errors to Inertia
                ->with('type', 'error')
                ->with('title', 'Validation Error')
                ->with('message', 'Please review all fields and try again.');
        }

        $user = Auth::user();
        $validated = $validator->validated();

        $page = ContentPages::find($validated['page']['content_page_id']);
        if ($page) {
            $page->title = $validated['page']['title'];
            $page->description = $validated['page']['description'];
            $page->save();
        } else {
            $page = ContentPages::create([
                'title' => $validated['page']['title'],
                'description' => $validated['page']['description'],
                'page' => $validated['page']['page'],
            ]);
        }

        ActivityLogService::contentManagementLog(
            userId: $user->user_id,
            activity: ActivityLogAction::Update,
            description: 'Updated Facilities Content Page',
        );

        $facility_id = [];

        foreach ($validated['facilities'] ?? [] as $facilityData) {
            $imagepath = null;
            $imagename = null;

            // Fetch existing facility (if it exists)
            $facility = Facilities::find($facilityData['facility_id']);

            // --- DELETE IF NO NEW IMAGE AND NO PREVIEW URL ---
            if (empty($facilityData['facility_image']) && empty($facilityData['previewUrl'])) {
                if ($facility && $facility->image_path && Storage::disk('s3')->exists($facility->image_path)) {
                    Storage::disk('s3')->delete($facility->image_path);
                }

                $imagename = null;
                $imagepath = null;
            }

            // --- UPLOAD NEW IMAGE IF PRESENT ---
            if (isset($facilityData['facility_image'])) {
                $imagename = $facilityData['facility_name'].'.'.$facilityData['facility_image']->getClientOriginalExtension();
                $imagepath = 'facilities/'.$imagename;

                // delete old image if exists
                if ($facility && $facility->image_path && Storage::disk('s3')->exists($facility->image_path)) {
                    Storage::disk('s3')->delete($facility->image_path);
                }

                $facilityData['facility_image']->storeAs('facilities', $imagename, 's3');
            }

            // --- UPDATE OR CREATE ---
            if ($facility) {
                $facility->update([
                    'facility_name' => $facilityData['facility_name'],
                    'description' => $facilityData['description'],
                    'image_name' => $imagename ?? $facility->image_name,
                    'image_path' => $imagepath ?? $facility->image_path,
                ]);
                $facility_id[] = $facility->facility_id;

                ActivityLogService::contentManagementLog(
                    userId: $user->user_id,
                    activity: ActivityLogAction::Update,
                    description: 'Updated Facility: '.$facility->facility_name,
                );

            } else {
                $facility = Facilities::create([
                    'facility_name' => $facilityData['facility_name'],
                    'description' => $facilityData['description'],
                    'image_name' => $imagename,
                    'image_path' => $imagepath,
                ]);
                $facility_id[] = $facility->facility_id;

                ActivityLogService::contentManagementLog(
                    userId: $user->user_id,
                    activity: ActivityLogAction::Create,
                    description: 'Created Facility: '.$facility->facility_name,
                );
            }
        }

        $facilitiesToDelete = Facilities::whereNotIn('facility_id', $facility_id)->get();
        foreach ($facilitiesToDelete as $facility) {
            if ($facility->image_path && Storage::disk('s3')->exists($facility->image_path)) {
                Storage::disk('s3')->delete($facility->image_path);
            }
        }
        Facilities::whereNotIn('facility_id', $facility_id)->delete();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Update Successful')
            ->with('message', 'Facilities content has been updated.');
    }
}

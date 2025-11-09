<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;
use App\Models\ContentPages;
use App\Models\Facilities;
use Illuminate\Http\Request;

class FacilitiesController extends Controller
{
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'page' => ['required', 'array'],
            'facilities' => ['nullable', 'array'],
            'page.page_id' => ['nullable', 'integer'],
            'page.title' => ['required', 'string'],
            'page.description' => ['required', 'string'],
            'facilities.*.facility_id' => ['required', 'integer'],
            'facilities.*.facility_name' => ['required', 'string'],
            'facilities.*.description' => ['required', 'string'],
            'facilities.*.facility_image' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg', 'max:5120'],
        ], [
            'page.title.required' => 'The page title is required.',
            'page.description.required' => 'The page description is required.',
            'facilities.*.facility_name.required' => 'The facility name is required.',
            'facilities.*.description.required' => 'The facility description is required.',
            'facilities.*.facility_image.image' => 'The facility image must be an image file.',
            'facilities.*.facility_image.mimes' => 'The facility image must be a file of type: jpeg, png, jpg.',
            'facilities.*.facility_image.max' => 'The facility image may not be greater than 5MB.',
        ]);

        $page_id = $validated['page']['page_id'] ?? null;
        if ($page_id) {
            $page = ContentPages::find($page_id);
            $page->title = $validated['page']['title'];
            $page->description = $validated['page']['description'];
            $page->save();
        } else {
            $page = ContentPages::create([
                'title' => $validated['page']['title'],
                'description' => $validated['page']['description'],
            ]);
        }

        $facility_id = [];

        foreach ($validated['facilities'] ?? [] as $facilityData) {
            $imagepath = null;
            $imagename = null;
            if (isset($facilityData['facility_image'])) {
                $imagename = $facilityData['facility_name'] . '.' . $facilityData['facility_image']->getClientOriginalExtension();
                $imagepath = 'facilities/' . $imagename;
                $facilityData['facility_image']->storeAs('facilities', $imagename, 'public');
            }

            if($facility = Facilities::find($facilityData['facility_id'])) {
                $facility->update([
                    'facility_name' => $facilityData['facility_name'],
                    'description' => $facilityData['description'],
                    'image_name' => $imagename ?? $facility->image_name,
                    'image_path' => $imagepath ?? $facility->image_path,
                ]);
                $facility_id[] = $facility->facility_id;
            } else {
                $facility = Facilities::create([
                    'facility_name' => $facilityData['facility_name'],
                    'description' => $facilityData['description'],
                    'image_name' => $imagename,
                    'image_path' => $imagepath,
                ]);
                $facility_id[] = $facility->facility_id;
            }
        };

        Facilities::whereNotIn('facility_id', $facility_id)->delete();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Update Sucessful')
            ->with('message', 'Facilities content has been updated.');
    }
}

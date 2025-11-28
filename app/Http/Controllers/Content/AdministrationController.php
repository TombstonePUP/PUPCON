<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContentPages;
use App\Models\UniversityAdministration;
use Illuminate\Support\Facades\Validator;

class AdministrationController extends Controller
{
    public function __invoke(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'page' => ['nullable', 'array'],
            'officials' => ['nullable', 'array'],
            'page.content_page_id' => ['nullable', 'integer'],
            'page.title' => ['required', 'string'],
            'page.subtitle' => ['required', 'string'],
            'page.page' => ['required', 'string'],
            'officials.*.administration_id' => ['required', 'integer'],
            'officials.*.first_name' => ['required', 'string'],
            'officials.*.middle_name' => ['nullable', 'string'],
            'officials.*.last_name' => ['required', 'string'],
            'officials.*.suffix' => ['nullable', 'string'],
            'officials.*.position' => ['required', 'string'],
            'officials.*.type' => ['required', 'string'],
            'officials.*.profile' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg', 'max:5120'],
        ], [
            'page.content_page_id.required' => 'The page content ID is required.',
            'page.title.required' => 'The page title is required.',
            'page.subtitle.required' => 'The page subtitle is required.',
            'page.page.required' => 'The page identifier is required.',
            'officials.*.first_name.required' => 'The official\'s first name is required.',
            'officials.*.last_name.required' => 'The official\'s last name is required.',
            'officials.*.type.required' => 'The official\'s type is required.',
            'officials.*.position.required' => 'The official\'s position is required.',
            'officials.*.profile.image' => 'The profile picture must be an image file.',
            'officials.*.profile.mimes' => 'The profile picture must be a file of type: jpeg, png, jpg.',
            'officials.*.profile.max' => 'The profile picture may not be greater than 5MB.',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator) // sends validation errors to Inertia
                ->with('type', 'error')
                ->with('title', 'Validation Error')
                ->with('message', 'Please review all fields and try again.');
        }

        $validated = $validator->validated();

        $page = ContentPages::find($validated['page']['content_page_id']);
        if($page) {
            $page->title = $validated['page']['title'];
            $page->subtitle = $validated['page']['subtitle'];
            $page->save();
        } else {
            $page = ContentPages::create([
                'title' => $validated['page']['title'],
                'subtitle' => $validated['page']['subtitle'],
                'page' => $validated['page']['page'],
            ]);
        }

        $administration_ids = [];
        foreach ($validated['officials'] ?? [] as $officialData) {
            $profilepath = null;
            $profilename = null;
            if (isset($officialData['profile'])) {
                $profilename = $officialData['first_name'] . '-' . $officialData['last_name'] . '.' . $officialData['profile']->getClientOriginalExtension();
                $profilepath = 'administration_profiles/' . $profilename;
                $officialData['profile']->storeAs('administration_profiles', $profilename, 'public');
            }

            if($official = UniversityAdministration::find($officialData['administration_id'])) {
                $official->update([
                    'first_name' => $officialData['first_name'],
                    'middle_name' => $officialData['middle_name'] ?? null,
                    'last_name' => $officialData['last_name'],
                    'suffix' => $officialData['suffix'] ?? null,
                    'position' => $officialData['position'],
                    'type' => $officialData['type'],
                    'profile_picture_name' => $profilename ?? $official->profile_picture_name,
                    'profile_picture_path' => $profilepath ?? $official->profile_picture_path,
                ]);
                $administration_ids[] = $official->administration_id;
            } else {
                $official = UniversityAdministration::create([
                    'first_name' => $officialData['first_name'],
                    'middle_name' => $officialData['middle_name'] ?? null,
                    'last_name' => $officialData['last_name'],
                    'suffix' => $officialData['suffix'] ?? null,
                    'position' => $officialData['position'],
                    'type' => $officialData['type'],
                    'profile_picture_name' => $profilename,
                    'profile_picture_path' => $profilepath,
                ]);
                $administration_ids[] = $official->administration_id;
            }
        }

        UniversityAdministration::whereNotIn('administration_id', $administration_ids)->delete();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Update Sucessful')
            ->with('message', 'Adminstration Content has been successfully updated.');
    }
}

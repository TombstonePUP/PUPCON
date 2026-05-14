<?php

namespace App\Http\Controllers\Content;

use App\Enums\ActivityLogAction;
use App\Http\Controllers\Controller;
use App\Models\ContentPages;
use App\Models\UniversityAdministration;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AdministrationController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
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
            'officials.*.profile' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg', 'max:20480'],
            'officials.*.previewUrl' => ['nullable', 'string'],
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
            'officials.*.profile.max' => 'The profile picture may not be greater than 20MB.',
        ]);

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

        ActivityLogService::contentManagementLog(
            userId: $user->user_id,
            activity: ActivityLogAction::Update,
            description: 'Updated University Administration Page',
        );

        $administration_ids = [];
        foreach ($validated['officials'] ?? [] as $officialData) {
            $profilepath = null;
            $profilename = null;

            $official = UniversityAdministration::find($officialData['administration_id']);

            // --- DELETE IF NO NEW IMAGE AND NO PREVIEW URL ---
            if (empty($officialData['profile']) && empty($officialData['previewUrl'])) {
                if ($official && $official->profile_picture_path && Storage::disk('public')->exists($official->profile_picture_path)) {
                    Storage::disk('public')->delete($official->profile_picture_path);
                }
                $profilename = null;
                $profilepath = null;
            }

            // --- UPLOAD NEW IMAGE IF PRESENT ---
            if (isset($officialData['profile'])) {
                $profilename = $officialData['first_name'].'-'.$officialData['last_name'].'.'.$officialData['profile']->getClientOriginalExtension();
                $profilepath = 'administration_profiles/'.$profilename;

                // delete old one
                if ($official && $official->profile_picture_path && Storage::disk('public')->exists($official->profile_picture_path)) {
                    Storage::disk('public')->delete($official->profile_picture_path);
                }

                $officialData['profile']->storeAs('administration_profiles', $profilename, 'public');
            }

            // --- UPDATE OR CREATE ---
            if ($official) {
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
                ActivityLogService::contentManagementLog(
                    userId: $user->user_id,
                    activity: ActivityLogAction::Update,
                    description: 'Updated University Official: '.$official->first_name.' '.$official->last_name,
                );
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
                ActivityLogService::contentManagementLog(
                    userId: $user->user_id,
                    activity: ActivityLogAction::Create,
                    description: 'Added University Official: '.$official->first_name.' '.$official->last_name,
                );
            }
        }

        $officialsToDelete = UniversityAdministration::whereNotIn('administration_id', $administration_ids)->get();
        foreach ($officialsToDelete as $official) {
            if ($official->profile_picture_path && Storage::disk('public')->exists($official->profile_picture_path)) {
                Storage::disk('public')->delete($official->profile_picture_path);
            }
            ActivityLogService::contentManagementLog(
                userId: $user->user_id,
                activity: ActivityLogAction::Delete,
                description: 'Deleted University Official: '.$official->first_name.' '.$official->last_name,
            );
        }

        UniversityAdministration::whereNotIn('administration_id', $administration_ids)->delete();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Update Sucessful')
            ->with('message', 'Adminstration Content has been successfully updated.');
    }
}

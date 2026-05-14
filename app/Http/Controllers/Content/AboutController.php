<?php

namespace App\Http\Controllers\Content;

use App\Enums\ActivityLogAction;
use App\Http\Controllers\Controller;
use App\Models\ContentPages;
use App\Models\Organizations;
use App\Models\OrganizationTypes;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AboutController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'page' => ['nullable', 'array'],
            'org_types' => ['nullable', 'array'],
            'page.content_page_id' => ['nullable', 'integer'],
            'page.title' => ['required', 'string'],
            'page.subtitle' => ['required', 'string'],
            'page.page' => ['required', 'string'],
            'page.address' => ['required', 'string'],
            'page.phone_number' => ['required', 'string'],
            'page.banner' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg', 'max:20480'],
            'org_types.*.type_id' => ['required', 'integer'],
            'org_types.*.type_name' => ['required', 'string'],
            'org_types.*.organizations' => ['nullable', 'array'],
            'org_types.*.organizations.*.organization_id' => ['required', 'integer'],
            'org_types.*.organizations.*.organization_name' => ['required', 'string'],
            'org_types.*.organizations.*.type_id' => ['required', 'integer'],
            'org_types.*.organizations.*.affiliation' => ['required', 'string'],
        ], [
            'page.content_page_id.required' => 'The page content ID is required.',
            'page.title.required' => 'The page title is required.',
            'page.subtitle.required' => 'The page subtitle is required.',
            'page.page.required' => 'The page identifier is required.',
            'page.address.required' => 'The address is required.',
            'page.phone_number.required' => 'The phone number is required.',
            'page.banner.image' => 'The banner must be an image file.',
            'page.banner.mimes' => 'The banner must be a file of type: jpeg, png, jpg.',
            'page.banner.max' => 'The banner may not be greater than 20MB.',
            'org_types.*.type_name.required' => 'The organization type name is required.',
            'org_types.*.organizations.*.organization_name.required' => 'The organization name is required.',
            'org_types.*.organizations.*.affiliation.required' => 'The organization affiliation is required.',
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
        if (isset($validated['page']['banner'])) {
            $bannerName = 'about-banner.'.$validated['page']['banner']->getClientOriginalExtension();
            $bannerPath = 'about-page/'.$bannerName;
            if (Storage::disk('public')->exists($bannerPath)) {
                Storage::disk('public')->delete($bannerPath);
            }
            $validated['page']['banner']->storeAs('about-page', $bannerName, 'public');
        }
        if ($page) {
            $page->title = $validated['page']['title'];
            $page->subtitle = $validated['page']['subtitle'];
            $page->address = $validated['page']['address'];
            $page->phone_number = $validated['page']['phone_number'];
            if (! empty($bannerName)) {
                $page->image_name = $bannerName ?? $page->image_name;
                $page->image_path = $bannerPath ?? $page->image_path;
            }
            $page->save();
        } else {
            $page = ContentPages::create([
                'title' => $validated['page']['title'],
                'subtitle' => $validated['page']['subtitle'],
                'page' => $validated['page']['page'],
                'address' => $validated['page']['address'],
                'phone_number' => $validated['page']['phone_number'],
                'image_name' => $bannerName ?? null,
                'image_path' => $bannerPath ?? null,
            ]);
        }

        ActivityLogService::contentManagementLog(
            userId: $user->user_id,
            activity: ActivityLogAction::Update,
            description: 'Updated About Page Content',
        );

        $type_ids = [];
        $organization_ids = [];
        foreach ($validated['org_types'] ?? [] as $typeData) {
            $type = OrganizationTypes::find($typeData['type_id']);
            if ($type) {
                $type->type_name = $typeData['type_name'];
                $type->save();
            } else {
                $type = OrganizationTypes::create([
                    'type_name' => $typeData['type_name'],
                ]);
            }
            $type_ids[] = $type->type_id;

            // $organization_ids = [];
            foreach ($typeData['organizations'] ?? [] as $orgData) {
                $organization = Organizations::find($orgData['organization_id']);
                if ($organization) {
                    $organization->organization_name = $orgData['organization_name'];
                    $organization->affiliation = $orgData['affiliation'];
                    $organization->type_id = $type->type_id;
                    $organization->save();

                    ActivityLogService::contentManagementLog(
                        userId: $user->user_id,
                        activity: ActivityLogAction::Update,
                        description: 'Updated Organization: '.$organization->organization_name,
                    );

                } else {
                    $organization = Organizations::create([
                        'organization_name' => $orgData['organization_name'],
                        'affiliation' => $orgData['affiliation'],
                        'type_id' => $type->type_id,
                    ]);

                    ActivityLogService::contentManagementLog(
                        userId: $user->user_id,
                        activity: ActivityLogAction::Create,
                        description: 'Created Organization: '.$organization->organization_name,
                    );
                }
                $organization_ids[] = $organization->organization_id;
            }
        }

        Organizations::whereNotIn('organization_id', $organization_ids)
            ->delete();
        OrganizationTypes::whereNotIn('type_id', $type_ids)->with('organizations')->delete();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Update Successful')
            ->with('message', 'About page updated successfully.');
    }
}

<?php

namespace App\Http\Controllers\Content;

use App\Enums\ActivityLogAction;
use App\Http\Controllers\Controller;
use App\Models\ContentPages;
use App\Models\OtherServices;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class OtherServicesController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return Response
     */
    public function index()
    {
        $services_page = ContentPages::where('page', 'Other Services')->first();
        $services = OtherServices::all();

        return inertia('content-management/other-services', [
            'services_page' => $services_page,
            'services' => $services,
        ]);
    }

    /**
     * Update the specified resource in storage.
     * @return RedirectResponse
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'page' => ['required', 'array'],
            'other_services' => ['nullable', 'array'],
            'page.content_page_id' => ['nullable', 'integer'],
            'page.page' => ['required', 'string'],
            'page.title' => ['required', 'string'],
            'page.subtitle' => ['required', 'string'],
            'other_services.*.service_id' => ['required', 'integer'],
            'other_services.*.service_name' => ['required', 'string'],
            'other_services.*.description' => ['required', 'string'],
            'other_services.*.service_link' => ['required', 'string'],
        ], [
            'page.content_page_id.required' => 'The page content ID is required.',
            'page.title.required' => 'The page title is required.',
            'page.subtitle.required' => 'The page subtitle is required.',
            'other_services.*.service_name.required' => 'The service name is required.',
            'other_services.*.description.required' => 'The service description is required.',
            'other_services.*.service_link.required' => 'The service link is required.',
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
            $page->page = $validated['page']['page'];
            $page->title = $validated['page']['title'];
            $page->subtitle = $validated['page']['subtitle'];
            $page->save();
        } else {
            $page = ContentPages::create([
                'page' => $validated['page']['page'],
                'title' => $validated['page']['title'],
                'subtitle' => $validated['page']['subtitle'],
            ]);
        }

        ActivityLogService::contentManagementLog(
            userId: $user->user_id,
            activity: ActivityLogAction::Update,
            description: 'Updated Other Services Content Page',
        );

        $service_ids = [];
        foreach ($validated['other_services'] as $serviceData) {
            $service = OtherServices::find($serviceData['service_id']);
            if ($service) {
                $service->service_name = $serviceData['service_name'];
                $service->description = $serviceData['description'];
                $service->service_link = $serviceData['service_link'];
                $service->save();

                ActivityLogService::contentManagementLog(
                    userId: $user->user_id,
                    activity: ActivityLogAction::Update,
                    description: 'Updated Other Service: ' . $service->service_name,
                );
            } else {
                $service = OtherServices::create([
                    'service_name' => $serviceData['service_name'],
                    'description' => $serviceData['description'],
                    'service_link' => $serviceData['service_link'],
                ]);
                ActivityLogService::contentManagementLog(
                    userId: $user->user_id,
                    activity: ActivityLogAction::Create,
                    description: 'Created Other Service: ' . $service->service_name,
                );
            }
            $service_ids[] = $service->service_id;
        }
        OtherServices::whereNotIn('service_id', $service_ids)->delete();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Update Successful')
            ->with('message', 'Other Services page updated successfully.');
    }
}

<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;
use App\Models\ContentPages;
use App\Models\OtherServices;
use Illuminate\Http\Request;

class OtherServicesController extends Controller
{
    /**
     * Display a listing of the resource.
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
     */
    public function update(Request $request, OtherServices $otherServices)
    {
        $validated = $request->validate([
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

        $service_ids = [];
        foreach ($validated['other_services'] as $serviceData) {
            $service = OtherServices::find($serviceData['service_id']);
            if ($service) {
                $service->service_name = $serviceData['service_name'];
                $service->description = $serviceData['description'];
                $service->service_link = $serviceData['service_link'];
                $service->save();
            } else {
                $service = OtherServices::create([
                    'service_name' => $serviceData['service_name'],
                    'description' => $serviceData['description'],
                    'service_link' => $serviceData['service_link'],
                ]);
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

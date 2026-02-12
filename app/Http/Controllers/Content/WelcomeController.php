<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\CampusGallery;
use App\Models\ContentPages;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class WelcomeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'page' => ['nullable', 'array'],
                'page.page' => ['required', 'string'],
                'page.content_page_id' => ['nullable', 'integer'],
                'page.director_name' => ['required', 'string'],
                'page.director_message' => ['required', 'string'],
                'page.director_image' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg', 'max:20480'],
                'page.previewUrl' => ['nullable', 'string'],
                'page.video_link' => ['nullable', 'string'],
                'page.video_title' => ['nullable', 'string'],
                'page.video_description' => ['nullable', 'string'],
                'page.certificate_of_authenticity' => ['nullable', 'file', 'mimes:pdf'],
                'gallery' => ['nullable', 'array'],
                'gallery.*.gallery_id' => ['required', 'integer'],
                'gallery.*.image' => [
                    Rule::requiredIf(function () use ($request) {
                        $index = null;
                        foreach ($request->input('gallery', []) as $i => $item) {
                            if (!isset($item['image']) && empty($item['previewUrl'])) {
                                $index = $i;
                                break;
                            }
                        }
                        return $index !== null;
                    }),
                    'nullable',
                    'file',
                    'image',
                    'mimes:jpeg,png,jpg',
                    'max:20480',
                ],
                'gallery.*.previewUrl' => ['nullable', 'string'],
                'gallery.*.description' => ['required', 'string'],
                'gallery.*.carousel' => ['nullable', 'boolean'],
            ],
            [
                'page.content_page_id.required' => 'The page content ID is required.',
                'page.director_name.required' => 'The director name is required.',
                'page.director_message.required' => 'The director message is required.',
                'page.page.required' => 'The page identifier is required.',
                'page.director_image.image' => 'The director image must be an image file.',
                'page.director_image.mimes' => 'The director image must be a file of type: jpeg, png, jpg.',
                'page.director_image.max' => 'The director image may not be greater than 20MB.',
                'page.certificate_of_authenticity.mimes' => 'The certificate of authenticity must be a file of type: pdf.',
                'gallery.*.description.required' => 'The gallery description is required.',
                'gallery.*.image.image' => 'The gallery image must be an image file.',
                'gallery.*.image.required' => 'The gallery image is required.',
                'gallery.*.image.mimes' => 'The gallery image must be a file of type: jpeg, png, jpg.',
                'gallery.*.image.max' => 'The gallery image may not be greater than 20MB.',
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
        if (isset($validated['page']['director_image'])) {
            if ($page && $page->director_image_path && Storage::disk()->exists($page->director_image_path)) {
                Storage::disk()->delete($page->director_image_path);
            }
            $imageName = 'director.' . $validated['page']['director_image']->getClientOriginalExtension();
            $directorImagePath = 'welcome/' . $imageName;
            $storedPath = $validated['page']['director_image']->storeAs('welcome', $imageName, 'public');
            $page->director_image_name = $imageName;
            $page->director_image_path = $storedPath;
        }
        if (isset($validated['page']['certificate_of_authenticity'])) {
            if ($page && $page->certificate_of_authenticity && Storage::disk()->exists($page->certificate_of_authenticity)) {
                Storage::disk()->delete($page->certificate_of_authenticity);
            }
            $certName = 'certificate_of_authenticity.' . $validated['page']['certificate_of_authenticity']->getClientOriginalExtension();
            $certPath = 'welcome/' . $certName;
            $storedCertPath = $validated['page']['certificate_of_authenticity']->storeAs('welcome', $certName, 'public');
            $page->certificate_of_authenticity = $storedCertPath;
        }
        if ($page->certificate_of_authenticity && !isset($validated['page']['certificate_of_authenticity'])) {
            if (Storage::disk()->exists($page->certificate_of_authenticity)) {
                Storage::disk()->delete($page->certificate_of_authenticity);
            }
            $page->certificate_of_authenticity = null;
        }
        if ($page) {
            $page->page = $validated['page']['page'];
            $page->director_name = $validated['page']['director_name'];
            $page->director_message = $validated['page']['director_message'];
            $page->video_link = $validated['page']['video_link'] ?? null;
            $page->video_title = $validated['page']['video_title'] ?? null;
            $page->video_description = $validated['page']['video_description'] ?? null;
            $page->save();
        } else {
            $page = ContentPages::create([
                'page' => $validated['page']['page'],
                'director_name' => $validated['page']['director_name'],
                'director_message' => $validated['page']['director_message'],
                'director_image_name' => $imageName ?? null,
                'director_image_path' => $directorImagePath ?? null,
                'video_link' => $validated['page']['video_link'] ?? null,
                'video_title' => $validated['page']['video_title'] ?? null,
                'video_description' => $validated['page']['video_description'] ?? null,
                'certificate_of_authenticity_name' => $certName ?? null,
                'certificate_of_authenticity_path' => $certPath ?? null,
            ]);
        }

        ActivityLog::create([
            'user_id' => $user->user_id,
            'description' => 'Updated Welcome Page Content',
            'activity' => 'Update',
            'type' => 'Content',
            'activity_date' => now(),
        ]);

        $gallery_ids = [];
        foreach ($validated['gallery'] ?? [] as $galleryData) {
            $imagePath = null;
            $imageName = null;
            if (isset($galleryData['image'])) {
                $imageName = 'gallery_' . uniqid() . '.' . $galleryData['image']->getClientOriginalExtension();
                $imagePath = 'welcome/gallery/' . $imageName;
                $galleryData['image']->storeAs('welcome/gallery', $imageName, 'public');
            }

            if ($gallery = CampusGallery::find($galleryData['gallery_id'])) {
                $gallery->update([
                    'description' => $galleryData['description'] ?? $gallery->description,
                    'image_name' => $imageName ?? $gallery->image_name,
                    'image_path' => $imagePath ?? $gallery->image_path,
                    'carousel' => $galleryData['carousel'] ?? $gallery->carousel,
                ]);
                ActivityLog::create([
                    'user_id' => $user->user_id,
                    'description' => 'Updated Welcome Page Gallery Item ID: ' . $gallery->gallery_id,
                    'activity' => 'Update',
                    'type' => 'Content',
                    'activity_date' => now(),
                ]);
                $gallery_ids[] = $gallery->gallery_id;
            } else {
                $gallery = CampusGallery::create([
                    'description' => $galleryData['description'] ?? null,
                    'image_name' => $imageName,
                    'image_path' => $imagePath,
                    'carousel' => $galleryData['carousel'] ?? false,
                ]);
                ActivityLog::create([
                    'user_id' => $user->user_id,
                    'description' => 'Created Welcome Page Gallery Item ID: ' . $gallery->gallery_id,
                    'activity' => 'Create',
                    'type' => 'Content',
                    'activity_date' => now(),
                ]);
                $gallery_ids[] = $gallery->gallery_id;
            }
        }

        $galleryToDelete = CampusGallery::where('carousel', 1)
            ->whereNotIn('gallery_id', $gallery_ids)->get();
        foreach ($galleryToDelete as $gallery) {
            if ($gallery->image_path && Storage::disk()->exists($gallery->image_path)) {
                Storage::disk()->delete($gallery->image_path);
            }
            ActivityLog::create([
                'user_id' => $user->user_id,
                'description' => 'Deleted Welcome Page Gallery Item ID: ' . $gallery->gallery_id,
                'activity' => 'Delete',
                'type' => 'Content',
                'activity_date' => now(),
            ]);
        }

        CampusGallery::where('carousel', true)
            ->whereNotIn('gallery_id', $gallery_ids)->delete();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Welcome Page Updated')
            ->with('message', 'The welcome page has been successfully updated.');
    }
}

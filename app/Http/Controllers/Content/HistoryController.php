<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;
use App\Models\CampusDirectors;
use App\Models\CampusGallery;
use Illuminate\Http\Request;
use App\Models\ContentPages;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class HistoryController extends Controller
{
    public function __invoke(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'page' => ['required', 'array'],
                'directors' => ['nullable', 'array'],
                'gallery' => ['nullable', 'array'],
                'page.page' => ['required', 'string'],
                'page.content_page_id' => ['nullable', 'integer'],
                'page.title' => ['required', 'string'],
                'page.description' => ['required', 'string'],
                'page.banner' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg', 'max:20480'],
                'directors.*.director_id' => ['required', 'integer'],
                'directors.*.name' => ['required', 'string'],
                'directors.*.description' => ['required', 'string'],
                'directors.*.term_start_date' => ['required', 'integer'],
                'directors.*.term_end_date' => ['nullable', 'integer'],
                'directors.*.profile_image' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg', 'max:20480'],
                'gallery.*.gallery_id' => ['required', 'integer'],
                'gallery.*.image' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg', 'max:20480',],
                'gallery.*.description' => ['nullable', 'string'],
            ],
            [
                'page.content_page_id.required' => 'The page content ID is required.',
                'page.title.required' => 'The page title is required.',
                'page.description.required' => 'The page description is required.',
                'page.page.required' => 'The page identifier is required.',
                'page.banner.image' => 'The banner must be an image file.',
                'page.banner.mimes' => 'The banner must be a file of type: jpeg, png, jpg.',
                'page.banner.max' => 'The banner may not be greater than 20MB.',
                'directors.*.name.required' => 'The director name is required.',
                'directors.*.description.required' => 'The director description is required.',
                'directors.*.term_start_date.required' => 'The director term start date is required.',
                'directors.*.profile_image.image' => 'The director profile image must be an image file.',
                'directors.*.profile_image.mimes' => 'The director profile image must be a file of type: jpeg, png, jpg.',
                'directors.*.profile_image.max' => 'The director profile image may not be greater than 20MB.',
                // 'gallery.*.image.required' => 'The gallery image is required.',
                'gallery.*.image.image' => 'The gallery image must be an image file.',
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

        $page = ContentPages::find($validated['page']['content_page_id']);
        if (isset($validated['page']['banner'])) {
            $bannerName = 'history-banner.' . $validated['page']['banner']->getClientOriginalExtension();
            $bannerPath = 'history-page/' . $bannerName;
            if (Storage::disk('public')->exists($page->image_path)) {
                Storage::disk('public')->delete($page->image_path);
            }
            $validated['page']['banner']->storeAs('history-page', $bannerName, 'public');
            $page->image_name = $bannerName;
            $page->image_path = $bannerPath;
        }
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
                'image_name' => $bannerName ?? null,
                'image_path' => $bannerPath ?? null,
            ]);
        }

        $director_ids = [];
        $gallery_ids = [];
        foreach ($validated['directors'] ?? [] as $directorData) {
            $profileImagePath = null;
            $profileImageName = null;
            if (isset($directorData['profile_image'])) {
                $profileImageName = $directorData['name'] . '.' . $directorData['profile_image']->getClientOriginalExtension();
                $profileImagePath = 'history-page/directors/' . $profileImageName;
                $directorData['profile_image']->storeAs('history-page/directors', $profileImageName, 'public');
            }

            if ($director = CampusDirectors::find($directorData['director_id'])) {
                $director->update([
                    'name' => $directorData['name'],
                    'term_start_date' => $directorData['term_start_date'],
                    'term_end_date' => $directorData['term_end_date'] ?? null,
                    'description' => $directorData['description'] ?? null,
                    'profile_image_name' => $profileImageName ?? $director->profile_image_name,
                    'profile_image_path' => $profileImagePath ?? $director->profile_image_path,
                ]);
                $director_ids[] = $director->director_id;
            } else {
                $director = CampusDirectors::create([
                    'name' => $directorData['name'],
                    'term_start_date' => $directorData['term_start_date'],
                    'term_end_date' => $directorData['term_end_date'] ?? null,
                    'description' => $directorData['description'] ?? null,
                    'profile_image_name' => $profileImageName,
                    'profile_image_path' => $profileImagePath,
                ]);
                $director_ids[] = $director->director_id;
            }
        };

        foreach ($validated['gallery'] ?? [] as $galleryData) {
            $galleryImagePath = null;
            $galleryImageName = null;
            if (isset($galleryData['image'])) {
                $galleryImageName = 'history-gallery-' . $galleryData['description'] . '.' . $galleryData['image']->getClientOriginalExtension();
                $galleryImagePath = 'history-page/gallery/' . $galleryImageName;
                $galleryData['image']->storeAs('history-page/gallery', $galleryImageName, 'public');
            }

            if ($gallery = CampusGallery::find($galleryData['gallery_id'])) {
                $gallery->update([
                    'image_name' => $galleryImageName ?? $gallery->image_name,
                    'image_path' => $galleryImagePath ?? $gallery->image_path,
                    'description' => $galleryData['description'] ?? null,
                ]);
                $gallery_ids[] = $gallery->gallery_id;
            } else {
                $gallery = CampusGallery::create([
                    'image_name' => $galleryImageName,
                    'image_path' => $galleryImagePath,
                    'description' => $galleryData['description'] ?? null,
                ]);
                $gallery_ids[] = $gallery->gallery_id;
            }
        };

        CampusDirectors::whereNotIn('director_id', $director_ids)->delete();
        CampusGallery::whereNotIn('gallery_id', $gallery_ids)->delete();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Update Successful')
            ->with('message', 'The History page has been successfully updated.');
    }
}

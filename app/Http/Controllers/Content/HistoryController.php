<?php

namespace App\Http\Controllers\Content;

use App\Enums\ActivityLogAction;
use App\Http\Controllers\Controller;
use App\Models\CampusDirectors;
use App\Models\CampusGallery;
use App\Models\ContentPages;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class HistoryController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
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
                'page.previewUrl' => ['nullable', 'string'],
                'directors.*.director_id' => ['required', 'integer'],
                'directors.*.name' => ['required', 'string'],
                'directors.*.description' => ['required', 'string'],
                'directors.*.term_start_date' => ['required', 'integer'],
                'directors.*.term_end_date' => ['required', 'integer'],
                'directors.*.profile_image' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg', 'max:20480'],
                'directors.*.previewUrl' => ['nullable', 'string'],
                'gallery.*.gallery_id' => ['required', 'integer'],
                'gallery.*.image' => [
                    Rule::requiredIf(function () use ($request) {
                        $index = null;
                        foreach ($request->input('gallery', []) as $i => $item) {
                            if (! isset($item['image']) && empty($item['previewUrl'])) {
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
                'gallery.*.description.required' => 'The gallery description is required.',
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

        if (isset($validated['page']['banner'])) {
            $bannerName = 'history-banner.'.$validated['page']['banner']->getClientOriginalExtension();
            $bannerPath = 'history-page/'.$bannerName;

            if ($page && $page->image_path && Storage::disk('public')->exists($page->image_path)) {
                Storage::disk('public')->delete($page->image_path);
            }

            $validated['page']['banner']->storeAs('history-page', $bannerName, 'public');
            $page->image_name = $bannerName;
            $page->image_path = $bannerPath;
        } elseif (empty($validated['page']['previewUrl']) && $page && $page->image_path) {
            if (Storage::disk('public')->exists($page->image_path)) {
                Storage::disk('public')->delete($page->image_path);
            }
            $page->image_name = null;
            $page->image_path = null;
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

        ActivityLogService::contentManagementLog(
            userId: $user->user_id,
            activity: ActivityLogAction::Update,
            description: 'Updated History Page Content',
        );

        $director_ids = [];
        $gallery_ids = [];

        foreach ($validated['directors'] ?? [] as $directorData) {
            $profileImagePath = null;
            $profileImageName = null;

            $director = CampusDirectors::find($directorData['director_id']);

            if (isset($directorData['profile_image'])) {
                $profileImageName = $directorData['name'].'.'.$directorData['profile_image']->getClientOriginalExtension();
                $profileImagePath = 'history-page/directors/'.$profileImageName;

                if ($director && $director->profile_image_path && Storage::disk('public')->exists($director->profile_image_path)) {
                    Storage::disk('public')->delete($director->profile_image_path);
                }

                $directorData['profile_image']->storeAs('history-page/directors', $profileImageName, 'public');
            } elseif (empty($directorData['previewUrl']) && $director && $director->profile_image_path) {
                if (Storage::disk('public')->exists($director->profile_image_path)) {
                    Storage::disk('public')->delete($director->profile_image_path);
                }
                $profileImageName = null;
                $profileImagePath = null;
            } else {
                // keep existing image
                $profileImageName = $director->profile_image_name ?? null;
                $profileImagePath = $director->profile_image_path ?? null;
            }

            // Update or create director
            if ($director) {
                $director->update([
                    'name' => $directorData['name'],
                    'term_start_date' => $directorData['term_start_date'],
                    'term_end_date' => $directorData['term_end_date'] ?? null,
                    'description' => $directorData['description'] ?? null,
                    'profile_image_name' => $profileImageName,
                    'profile_image_path' => $profileImagePath,
                ]);
                $director_ids[] = $director->director_id;
                ActivityLogService::contentManagementLog(
                    userId: $user->user_id,
                    activity: ActivityLogAction::Update,
                    description: 'Updated Campus Director: '.$directorData['name'],
                );
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
                ActivityLogService::contentManagementLog(
                    userId: $user->user_id,
                    activity: ActivityLogAction::Create,
                    description: 'Added Campus Director: '.$directorData['name'],
                );
            }
        }

        foreach ($validated['gallery'] ?? [] as $galleryData) {
            $galleryImagePath = null;
            $galleryImageName = null;
            if (isset($galleryData['image'])) {
                $galleryImageName = 'history-gallery-'.uniqid().'-'.$galleryData['description'].'.'.$galleryData['image']->getClientOriginalExtension();
                $galleryImagePath = 'history-page/gallery/'.$galleryImageName;
                $galleryData['image']->storeAs('history-page/gallery', $galleryImageName, 'public');
            }

            if ($gallery = CampusGallery::find($galleryData['gallery_id'])) {
                $gallery->update([
                    'image_name' => $galleryImageName ?? $gallery->image_name,
                    'image_path' => $galleryImagePath ?? $gallery->image_path,
                    'description' => $galleryData['description'] ?? null,
                ]);
                $gallery_ids[] = $gallery->gallery_id;

                ActivityLogService::contentManagementLog(
                    userId: $user->user_id,
                    activity: ActivityLogAction::Update,
                    description: 'Updated Campus Gallery Image: '.$galleryData['description'],
                );
            } else {
                $gallery = CampusGallery::create([
                    'image_name' => $galleryImageName,
                    'image_path' => $galleryImagePath,
                    'description' => $galleryData['description'] ?? null,
                ]);
                $gallery_ids[] = $gallery->gallery_id;
                ActivityLogService::contentManagementLog(
                    userId: $user->user_id,
                    activity: ActivityLogAction::Create,
                    description: 'Added Campus Gallery Image: '.$galleryData['description'],
                );
            }
        }

        $directorsToDelete = CampusDirectors::whereNotIn('director_id', $director_ids)->get();

        foreach ($directorsToDelete as $director) {
            if ($director->profile_image_path && Storage::disk('public')->exists($director->profile_image_path)) {
                Storage::disk('public')->delete($director->profile_image_path);
            }
            ActivityLogService::contentManagementLog(
                userId: $user->user_id,
                activity: ActivityLogAction::Delete,
                description: 'Deleted Campus Director: '.$director->name,
            );
        }

        $galleryToDelete = CampusGallery::where('carousel', false)
            ->whereNotIn('gallery_id', $gallery_ids)->get();

        foreach ($galleryToDelete as $gallery) {
            if ($gallery->image_path && Storage::disk('public')->exists($gallery->image_path)) {
                Storage::disk('public')->delete($gallery->image_path);
            }
            ActivityLogService::contentManagementLog(
                userId: $user->user_id,
                activity: ActivityLogAction::Delete,
                description: 'Deleted Campus Gallery Image: '.$gallery->description,
            );
        }

        CampusDirectors::whereNotIn('director_id', $director_ids)->delete();
        CampusGallery::where('carousel', false)
            ->whereNotIn('gallery_id', $gallery_ids)->delete();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Update Successful')
            ->with('message', 'The History page has been successfully updated.');
    }
}

<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;
use App\Models\Programs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProgramContentController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        // dd($request->all());
        $validator = Validator::make(
            $request->all(),
            [
                'banner' => ['nullable', 'file', 'mimes:jpg,jpeg,png', 'max:20480'],
                'previewUrl' => ['nullable', 'string'],
                'description' => ['nullable', 'string', 'max:5000'],
                'objectives' => ['nullable', 'array'],
                'gallery' => ['nullable', 'array'],
                'objectives.*.objective_id' => ['required', 'integer'],
                'objectives.*.title' => ['required', 'string', 'max:255'],
                'objectives.*.description' => ['required', 'string'],
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
                    'mimes:jpg,jpeg,png',
                    'max:20480'
                ],
                'gallery.*.previewUrl' => ['nullable', 'string'],
                'gallery.*.caption' => ['required', 'string', 'max:255'],
            ],
            [
                // 'banner.image' => 'The banner must be an image file.',
                'banner.mimes' => 'The banner must be a file of type: jpg, jpeg, png.',
                'banner.max' => 'The banner may not be greater than 20MB.',
                'objectives.*.title.required' => 'The objective title is required.',
                'objectives.*.description.required' => 'The objective description is required.',
                'gallery.*.image.required' => 'The gallery image is required.',
                // 'gallery.*.image.required_without' => 'The gallery image is required',
                // 'gallery.*.image.sometimes' => 'The gallery image is required.',
                'gallery.*.image.mimes' => 'The gallery image must be a file of type: jpg, jpeg, png.',
                'gallery.*.image.max' => 'The gallery image may not be greater than 20MB.',
                'gallery.*.caption.required' => 'The gallery caption is required.',
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


        $program = Programs::findOrFail($request->program_id);
        $bannerName = null;
        $bannerPath = null;
        $program_name = Str::slug($program->program_name, '_');
        if (isset($validated['banner'])) {
            $bannerName = $program_name . '_banner.' . $validated['banner']->getClientOriginalExtension();
            $bannerPath = $program_name . '/assets/' . $bannerName;
            if (Storage::disk('public')->exists($bannerPath)) {
                Storage::disk('public')->delete($bannerPath);
            }
            $validated['banner']->storeAs($program_name . '/assets/', $bannerName, 'public');
        }

        if ($program->program_image_path && !isset($validated['previewUrl'])) {
            Storage::disk('public')->delete($program->program_image_path);
            $program->program_image_name = null;
            $program->program_image_path = null;
        }

        $program->program_description = $validated['description'] ?? $program->program_description;
        if (isset($bannerName) && isset($bannerPath)) {
            $program->program_image_name = $bannerName;
            $program->program_image_path = $bannerPath;
        }

        $program->save();

        $objective_ids = [];
        foreach ($validated['objectives'] ?? [] as $objective) {
            $objectiveModel = $program->Objectives()->find($objective['objective_id']);
            if ($objectiveModel) {
                $objectiveModel->objective_title = $objective['title'];
                $objectiveModel->objective_description = $objective['description'] ?? $objectiveModel->description;
                $objectiveModel->save();
                $objective_ids[] = $objectiveModel->program_objective_id;
            } else {
                $newObjective = $program->Objectives()->create([
                    'objective_title' => $objective['title'],
                    'objective_description' => $objective['description'] ?? null,
                ]);
                $objective_ids[] = $newObjective->program_objective_id;
            }
        }
        $program->Objectives()
            ->whereNotIn('program_objective_id', $objective_ids)
            ->delete();

        $gallery_ids = [];
        foreach ($validated['gallery'] ?? [] as $galleryItem) {
            $galleryModel = $program->Gallery()->find($galleryItem['gallery_id']);
            $imageName = null;
            $imagePath = null;
            if (isset($galleryItem['image'])) {
                $caption = Str::slug($galleryItem['caption'], '_');
                $imageName = 'gallery_' . $caption . '.' . $galleryItem['image']->getClientOriginalExtension();
                $imagePath = $program_name . '/assets/gallery/' . $imageName;
                if (Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                };
                $galleryItem['image']->storeAs($program_name . '/assets/gallery/', $imageName, 'public');
            }
            if ($galleryModel) {
                $galleryModel->image_name = $imageName ?? $galleryModel->image_name;
                $galleryModel->image_path = $imagePath ?? $galleryModel->image_path;
                $galleryModel->caption = $galleryItem['caption'] ?? $galleryModel->caption;
                $galleryModel->save();
                $gallery_ids[] = $galleryModel->program_gallery_id;
            } else {
                $newGallery = $program->Gallery()->create([
                    'image_name' => $imageName,
                    'image_path' => $imagePath,
                    'caption' => $galleryItem['caption'] ?? null,
                ]);
                $gallery_ids[] = $newGallery->program_gallery_id;
            }
        }
        $program->Gallery()
            ->whereNotIn('program_gallery_id', $gallery_ids)
            ->delete();

        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Success')
            ->with('message', 'Program content updated successfully.');
    }
}

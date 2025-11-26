<?php

namespace App\Http\Controllers\Content;

use App\Http\Controllers\Controller;
use App\Models\ContentPages;
use App\Models\FacultyStaff;
use Illuminate\Http\Request;

class FacultyStaffController extends Controller
{
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'page' => ['required', 'array'],
            'faculties' => ['nullable', 'array'],
            'page.content_page_id' => ['nullable', 'integer'],
            'page.page' => ['required', 'string', 'max:255'],
            'page.title' => ['required', 'string', 'max:255'],
            'page.subtitle' => ['required', 'string', 'max:255'],
            'page.author' => ['nullable', 'string', 'max:255'],
            'page.quote' => ['nullable', 'string'],
            'faculties.*.faculty_staff_id' => ['nullable', 'integer'],
            'faculties.*.first_name' => ['required', 'string', 'max:255'],
            'faculties.*.middle_name' => ['nullable', 'string', 'max:255'],
            'faculties.*.last_name' => ['required', 'string', 'max:255'],
            'faculties.*.personnel_type' => ['required', 'string', 'max:255'],
            'faculties.*.status' => ['nullable', 'string', 'max:255'],
            'faculties.*.program_id' => ['nullable', 'integer'],
            'faculties.*.program_coordinator' => ['required', 'boolean'],
            'faculties.*.faculty_image' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg', 'max:5120'],
        ], [
            'page.page_content_id.required' => 'The page content ID is required.',
            'page.page_content_id.exists' => 'The selected page content ID is invalid.',
            'page.page.required' => 'The page identifier is required.',
            'page.title.required' => 'The page title is required.',
            'page.subtitle.required' => 'The page subtitle is required.',
            'faculties.*.first_name.required' => 'The faculty/staff first name is required.',
            'faculties.*.last_name.required' => 'The faculty/staff last name is required.',
            'faculties.*.personnel_type.required' => 'The personnel type is required.',
            'faculties.*.program_coordinator.required' => 'The program coordinator field is required.',
            'faculties.*.faculty_image.image' => 'The faculty/staff image must be an image file.',
            'faculties.*.faculty_image.mimes' => 'The faculty/staff image must be a file of type: jpeg, png, jpg.',
            'faculties.*.faculty_image.max' => 'The faculty/staff image may not be greater than 5MB.',
        ]);

        $page = ContentPages::find($validated['page']['content_page_id']);
        if ($page) {
            $page->title = $validated['page']['title'];
            $page->subtitle = $validated['page']['subtitle'];
            $page->author = $validated['page']['author'] ?? null;
            $page->quote = $validated['page']['quote'] ?? null;
            $page->save();
        } else {
            $page = ContentPages::create([
                'title' => $validated['page']['title'],
                'subtitle' => $validated['page']['subtitle'],
                'author' => $validated['page']['author'] ?? null,
                'quote' => $validated['page']['quote'] ?? null,
                'page' => $validated['page']['page'],
            ]);
        }
        $faculty_staff_ids = [];
        foreach ($validated['faculties'] ?? [] as $facultyData) {
            $imagepath = null;
            $imagename = null;
            if (isset($facultyData['faculty_image'])) {
                $imagename = $facultyData['first_name'] . '-' . $facultyData['last_name'] . '.' . $facultyData['faculty_image']->getClientOriginalExtension();
                $imagepath = 'faculty_staff_images/' . $imagename;
                $facultyData['faculty_image']->storeAs('faculty_staff_images', $imagename, 'public');
            }

            if ($faculty = FacultyStaff::find($facultyData['faculty_staff_id'])) {
                $faculty->update([
                    'first_name' => $facultyData['first_name'],
                    'middle_name' => $facultyData['middle_name'] ?? null,
                    'last_name' => $facultyData['last_name'],
                    'personnel_type' => $facultyData['personnel_type'],
                    'status' => $facultyData['status'] ?? null,
                    'program_id' => $facultyData['program_id'] ?? null,
                    'program_coordinator' => $facultyData['program_coordinator'],
                    'image_name' => $imagename ?? $faculty->image_name,
                    'image_path' => $imagepath ?? $faculty->image_path,
                ]);
                $faculty_staff_ids[] = $faculty->faculty_staff_id;
            } else {
                $faculty = FacultyStaff::create([
                    'first_name' => $facultyData['first_name'],
                    'middle_name' => $facultyData['middle_name'] ?? null,
                    'last_name' => $facultyData['last_name'],
                    'personnel_type' => $facultyData['personnel_type'],
                    'status' => $facultyData['status'] ?? null,
                    'program_id' => $facultyData['program_id'] ?? null,
                    'program_coordinator' => $facultyData['program_coordinator'],
                    'image_name' => $imagename,
                    'image_path' => $imagepath,
                ]);
                $faculty_staff_ids[] = $faculty->faculty_staff_id;
            }
        }
        FacultyStaff::whereNotIn('faculty_staff_id', $faculty_staff_ids)->delete();
        return redirect()->back()
            ->with('type', 'success')
            ->with('title', 'Update Successful')
            ->with('message', 'Faculty and Staff page updated successfully.');
    }
}

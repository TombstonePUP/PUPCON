<?php

namespace Tests\Unit;

use App\Models\AreaFormCategory;
use App\Models\AreaForms;
use App\Models\Areas;
use App\Models\FileStatus;
use App\Models\Programs;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AreaFormsControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_upload_file(): void
    {
        Programs::factory()->create([
            'program_id' => 1,
            'program_name' => 'Testing',
        ]);

        Areas::factory()->create([
            'area_id' => 1,
            'program_id' => 1,
            'area_name' => 'Testing',
        ]);

        AreaFormCategory::factory()->create([
            'area_form_category_id' => 1,
            'category_name' => 'Test Category',
        ]);

        FileStatus::factory()->create([
            'file_status_id' => 1,
            'status_name' => 'Pending',
        ]);

        Storage::fake('public');

        $image = UploadedFile::fake()->image('test-image.jpg');
        $file = UploadedFile::fake()->create('test-file.pdf', 100, 'application/pdf');

        $response = $this->post(route('test.addForm', [ 'program_name' => 'Testing', 'area_id' => 1]), [
            'area_id' => 1,
            'area_form_category_id' => 1,
            'form_image' => $image,
            'form_file' => $file,
        ]);

        // $response->assertStatus();

        Storage::disk('public')->assertExists('Testing/Testing/area-forms/images/'.$image->hashName());
        Storage::disk('public')->assertExists('Testing/Testing/area-forms/files/'.$file->hashName());
    }

    /* public function test_update_file(): void
    {
        Programs::factory()->create([
            'program_id' => 1,
            'program_name' => 'Information Technology',
        ]);

        Areas::factory()->create([
            'area_id' => 1,
            'program_id' => 1,
            'area_name' => 'Testing',
        ]);

        AreaFormCategory::factory()->create([
            'area_form_category_id' => 1,
            'category_name' => 'Test Category',
        ]);

        FileStatus::factory()->create([
            'file_status_id' => 1,
            'status_name' => 'Pending',
        ]);

        $file = AreaForms::factory()->create([
            'area_id' => 1,
            'area_form_category_id' => 1,
            'area_form_id' => 1,
            'form_image_name' => 'test-image.jpg',
            'form_image_path' => 'test/path/to/image',
            'file_name' => 'test-file.pdf',
            'file_path' => 'test/path/to/file',
        ]);

        $storage = fake('public');

        $response = $this->post(route('test.updateForm', [ 'program_name' => 'Information Technology', 'area_id' => 1, 'form_id' => 1]), [
            'area_id' => 1,
            'area_form_category_id' => 1,
            'form_image' => null,
            'form_file' => 'test-file.pdf',
        ]);

        $response->assertStatus(302);
    } */
}

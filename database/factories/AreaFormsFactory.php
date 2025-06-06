<?php

namespace Database\Factories;

use App\Models\AreaFormCategory;
use App\Models\Areas;
use App\Models\FileStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AreaForms>
 */
class AreaFormsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $area = Areas::inRandomOrder()->first();
        $areaFormCategory = AreaFormCategory::inRandomOrder()->first();
        $fileStatusId = FileStatus::inRandomOrder()->first();
        return [
            'area_form_id' => fake()->unique()->randomNumber(),
            'area_id' => $area->area_id,
            'area_form_category_id' => $areaFormCategory->area_form_category_id,
            'form_image_name' => fake()->word(),
            'form_image_path' => fake()->imageUrl(),
            'file_name' => fake()->word(),
            'file_path' => fake()->imageUrl(),
            'file_status_id' => $fileStatusId->file_status_id,
            'file_rejection_reason' => fake()->sentence(),
        ];
    }
}

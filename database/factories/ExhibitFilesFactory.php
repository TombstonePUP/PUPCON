<?php

namespace Database\Factories;

use App\Models\ExhibitOutlines;
use App\Models\FileStatus;
use Illuminate\Database\Query\Builder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ExhibitFiles>
 */
class ExhibitFilesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $exhibitOutline = ExhibitOutlines::inRandomOrder()->first();
        $fileStatus = FileStatus::inRandomOrder()->first();
        return [
            'exhibit_file_id' => fake()->unique()->randomNumber(),
            'exhibit_outline_id' => $exhibitOutline->exhibit_outline_id,
            'file_name' => fake()->word(),
            'file_path' => fake()->filePath(),
            'file_status_id' => $fileStatus->file_status_id,
            'file_rejection_reason' => fake()->sentence(),
        ];
    }
}

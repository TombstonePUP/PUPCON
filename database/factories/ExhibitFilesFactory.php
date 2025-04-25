<?php

namespace Database\Factories;

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
        return [
            'exhibit_file_id' => fake()->unique()->randomNumber(),
            'exhibit_id' => ExhibitsFactory::new()->create()->exhibit_id,
            'file_name' => fake()->word(),
            'file_path' => fake()->filePath(),
            'file_status_id' => FileStatusFactory::new()->create()->file_status_id,
            'file_rejection_reason' => fake()->sentence(),
        ];
    }
}

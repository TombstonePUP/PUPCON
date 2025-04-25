<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AreaFiles>
 */
class AreaFilesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'area_file_id' => fake()->unique()->randomNumber(),
            'parameter_outline_id' => ParameterOutlinesFactory::new()->create()->parameter_outline_id,
            'file_name' => fake()->word(),
            'file_path' => fake()->filePath(),
            'file_status_id' => FileStatusFactory::new()->create()->file_status_id,
            'file_rejection_reason' => fake()->sentence(),
        ];
    }
}

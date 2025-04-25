<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Programs>
 */
class ProgramsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'program_id' => fake()->unique()->randomNumber(),
            'degree_type' => fake()->word(),
            'program_name' => fake()->word(),
            'program_image_name' => fake()->imageUrl(),
            'program_image_path' => fake()->imageUrl(),
            'program_description' => fake()->sentence(),
            'accreditation_level' => fake()->randomNumber(),
            'under_survey' => fake()->boolean(),
            'overview_description' => fake()->sentence(),
            'overview_image_name' => fake()->imageUrl(),
            'overview_image_path' => fake()->imageUrl(),
        ];
    }
}

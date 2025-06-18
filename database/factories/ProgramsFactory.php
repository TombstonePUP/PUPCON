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
            'program_description' => fake()->paragraphs(4, true),
            'accreditation_level' => fake()->randomNumber(),
            'under_survey' => fake()->boolean(),
            'program_image_name' => fake()->word(),
            'program_image_path' => fake()->imageUrl(),
            'overview_image_name' => fake()->word(),
            'overview_image_path' => fake()->imageUrl(),
            'overview_description' => fake()->paragraphs(4, true),
            'page_banner_image_name' => fake()->word(),
            'page_banner_image_path' => fake()->imageUrl()
        ];
    }
}

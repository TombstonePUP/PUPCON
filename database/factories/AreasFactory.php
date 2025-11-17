<?php

namespace Database\Factories;

use App\Models\AccreditationLevels;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Programs;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Areas>
 */
class AreasFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $accreditationLevel = AccreditationLevels::inRandomOrder()->first();
        return [
            'area_id' => fake()->unique()->randomNumber(),
            'accreditation_level_id' => $accreditationLevel->accreditation_level_id,
            'area_number' => fake()->numberBetween(1, 15),
            'area_name' => fake()->unique()->word(),
            'area_description' => fake()->paragraphs(4, true),
            'area_image_name' => fake()->word(),
            'area_image_path' => fake()->imageUrl(),
            'mean' => fake()->randomFloat(2, 0, 5),
        ];
    }
}

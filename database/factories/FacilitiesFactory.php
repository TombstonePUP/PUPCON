<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Facilities>
 */
class FacilitiesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'facility_id' => fake()->unique()->randomNumber(),
            'facility_name' => fake()->word(),
            'description' => fake()->sentence(),
            'image_name' => fake()->word(),
            'image_path' => fake()->imageUrl(),
        ];
    }
}

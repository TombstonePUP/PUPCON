<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

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
        return [
            'area_id' => fake()->unique()->randomNumber(),
            'area_number' => fake()->unique()->randomNumber(),
            'area_name' => fake()->unique()->word(),
            'area_description' => fake()->sentence(),
            'area_image_name' => fake()->imageUrl(),
            'area_image_path' => fake()->imageUrl(),
        ];
    }
}

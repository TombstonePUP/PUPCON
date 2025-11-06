<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CampusDirectors>
 */
class CampusDirectorsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'director_id' => fake()->unique()->randomNumber(),
            'name' => fake()->name(),
            'term_start_date' => fake()->date(),
            'term_end_date' => fake()->date(),
            'description' => fake()->paragraphs(4, true),
            'profile_image_name' => fake()->word(),
            'profile_image_path' => fake()->imageUrl(),
        ];
    }
}

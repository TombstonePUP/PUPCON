<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UniversityAdministration>
 */
class UniversityAdministrationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'administration_id' => fake()->unique()->randomNumber(),
            'first_name' => fake()->name(),
            'middle_name' => fake()->name(),
            'last_name' => fake()->name(),
            'suffix' => fake()->suffix(),
            'position' => fake()->jobTitle(),
            'profile_image_name' => fake()->imageUrl(),
            'profile_image_path' => fake()->imageUrl(),
        ];
    }
}

<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Exhibits>
 */
class ExhibitsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'exhibit_id' => fake()->unique()->randomNumber(),
            'exhibit_name' => fake()->word(),
            'container' => fake()->boolean(),
        ];
    }
}

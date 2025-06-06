<?php

namespace Database\Factories;

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
        $program = Programs::inRandomOrder()->first();
        return [
            'area_id' => fake()->unique()->randomNumber(),
            'program_id' => $program->program_id,
            'area_number' => fake()->unique()->randomNumber(),
            'area_name' => fake()->unique()->word(),
            'area_description' => fake()->sentence(),
            'area_image_name' => fake()->word(),
            'area_image_path' => fake()->imageUrl(),
        ];
    }
}

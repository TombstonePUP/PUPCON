<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ParameterOutlineCategory>
 */
class ParameterOutlineCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'parameter_outline_category_id' => fake()->unique()->randomNumber(),
            'category_name' => fake()->word(),
        ];
    }
}

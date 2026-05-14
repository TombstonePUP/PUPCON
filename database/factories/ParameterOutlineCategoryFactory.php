<?php

namespace Database\Factories;

use App\Models\ParameterOutlineCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ParameterOutlineCategory>
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
            /* 'parameter_outline_category_id' => $this->faker->unique()->randomNumber(),
            'category_name' => $this->faker->word(), */
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\AreaFormCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AreaFormCategory>
 */
class AreaFormCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            /* 'area_form_category_id' => $this->faker->unique()->randomNumber(),
            'category_name' => $this->faker->word(), */
        ];
    }
}

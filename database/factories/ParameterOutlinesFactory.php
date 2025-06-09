<?php

namespace Database\Factories;

use App\Models\AreaParameters;
use App\Models\ParameterOutlineCategory;
use Illuminate\Database\Query\Builder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ParameterOutlines>
 */
class ParameterOutlinesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $areaParameter = AreaParameters::inRandomOrder()->first();
        $outlineCategory = ParameterOutlineCategory::inRandomOrder()->first();
        return [
            'parameter_outline_id' => fake()->unique()->randomNumber(),
            'area_parameter_id' => $areaParameter->area_parameter_id,
            'parameter_outline_category_id' => $outlineCategory->parameter_outline_category_id,
            'outline_number' => fake()->unique()->randomFloat(2, 1, 20),
            'outline_description' => fake()->sentence(),
            'container' => fake()->boolean(),
        ];
    }
}

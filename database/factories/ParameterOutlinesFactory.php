<?php

namespace Database\Factories;

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
        return [
            'parameter_outline_id' => fake()->unique()->randomNumber(),
            'area_parameter_id' => AreaParametersFactory::new()->create()->area_parameter_id,
            'outline_name' => fake()->word(),
            'outline_description' => fake()->sentence(),
        ];
    }
}

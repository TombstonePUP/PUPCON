<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AreaParameters>
 */
class AreaParametersFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'area_parameter_id' => fake()->unique()->randomNumber(),
            'program_id' => ProgramsFactory::new()->create()->program_id,
            'area_id' => AreasFactory::new()->create()->area_id,
            'parameter_name' => fake()->word(),
            'parameter_description' => fake()->sentence(),
        ];
    }
}

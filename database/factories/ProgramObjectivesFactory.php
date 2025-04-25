<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProgramObjectives>
 */
class ProgramObjectivesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'program_objective_id' => fake()->unique()->randomNumber(),
            'program_id' => ProgramsFactory::new()->create()->program_id,
            'objective_description' => fake()->sentence(),
        ];
    }
}

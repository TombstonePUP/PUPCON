<?php

namespace Database\Factories;

use App\Models\ProgramObjectives;
use App\Models\Programs;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProgramObjectives>
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
        $program = Programs::inRandomOrder()->first();

        return [
            // 'program_objective_id' => $this->faker->unique()->randomNumber(),
            'program_id' => $program->program_id,
            /* 'objective_title' => $this->faker->sentence(),
            'objective_description' => $this->faker->sentence(), */
        ];
    }
}

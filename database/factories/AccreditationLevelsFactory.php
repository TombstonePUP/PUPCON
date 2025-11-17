<?php

namespace Database\Factories;

use App\Models\Programs;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AccreditationLevels>
 */
class AccreditationLevelsFactory extends Factory
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
            'accreditation_level_id' => fake()->unique()->randomNumber(),
            'program_id' => $program->program_id,
            'level' => fake()->numberBetween(0, 6),
            'remarks' => fake()->word(),
            'survey_date' => fake()->date(),
            'mean' => fake()->randomFloat(2, 0, 5),
            'is_active' => fake()->boolean(),
        ];
    }
}

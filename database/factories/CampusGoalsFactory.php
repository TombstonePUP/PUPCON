<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CampusGoals>
 */
class CampusGoalsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'goal_id' => fake()->unique()->randomNumber(),
            'goal_title_eng' => fake()->sentence(),
            'goal_desc_eng' => fake()->paragraphs(3, true),
            'goal_title_fil' => fake()->sentence(),
            'goal_desc_fil' => fake()->paragraphs(3, true),
        ];
    }
}

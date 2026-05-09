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
            /* 'goal_id' => $this->faker->unique()->randomNumber(),
            'goal_title_eng' => $this->faker->sentence(),
            'goal_desc_eng' => $this->faker->paragraphs(3, true),
            'goal_title_fil' => $this->faker->sentence(),
            'goal_desc_fil' => $this->faker->paragraphs(3, true), */
        ];
    }
}

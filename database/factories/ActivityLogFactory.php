<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ActivityLog>
 */
class ActivityLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'activity_log_id' => fake()->unique()->randomNumber(),
            'user_id' => UserFactory::new()->create()->user_id,
            'area' => fake()->word(),
            'program' => fake()->word(),
            'file_name' => fake()->word(),
            'activity' => fake()->randomElement(['upload', 'approved', 'rejected']),
            'activity_date' => fake()->dateTimeThisMonth()
        ];
    }
}

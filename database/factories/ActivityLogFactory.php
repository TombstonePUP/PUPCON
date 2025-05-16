<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Query\Builder;
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
        $user = User::inRandomOrder()->first();
        return [
            'activity_log_id' => fake()->unique()->randomNumber(),
            'user_id' => $user->user_id,
            'area' => fake()->word(),
            'program' => fake()->word(),
            'file_name' => fake()->word(),
            'activity' => fake()->randomElement(['upload', 'delete', 'approval', 'rejection']),
            'activity_date' => fake()->dateTimeThisMonth()
        ];
    }
}

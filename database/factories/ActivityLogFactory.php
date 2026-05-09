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
            // 'activity_log_id' => $this->faker->unique()->randomNumber(),
            'user_id' => $user->user_id,
            /* 'area' => $this->faker->word(),
            'program' => $this->faker->word(),
            'file_name' => $this->faker->word(),
            'activity' => $this->faker->randomElement(['upload', 'delete', 'approval', 'rejection']),
            'activity_date' => $this->faker->dateTimeThisMonth() */
        ];
    }
}

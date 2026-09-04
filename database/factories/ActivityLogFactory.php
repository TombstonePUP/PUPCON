<?php

namespace Database\Factories;

use App\Enums\ActivityLogAction;
use App\Enums\ActivityLogType;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ActivityLog>
 */
class ActivityLogFactory extends Factory
{
    protected $model = ActivityLog::class;

    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->value('user_id') ?? User::factory(),
            'description' => $this->faker->sentence(),
            'activity' => $this->faker->randomElement(ActivityLogAction::cases())->value,
            'type' => $this->faker->randomElement(ActivityLogType::cases())->value,
            'activity_date' => $this->faker->dateTimeThisMonth(),
        ];
    }
}

<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LocalTaskForce>
 */
class LocalTaskForceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'local_task_force_id' => fake()->unique()->randomNumber(),
            'user_id' => UserFactory::new()->create()->user_id,
            'profile_image_name' => fake()->imageUrl(),
            'profile_image_path' => fake()->imageUrl(),
        ];
    }
}

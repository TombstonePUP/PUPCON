<?php

namespace Database\Factories;

use App\Models\Areas;
use App\Models\Programs;
// use App\Models\User;
use Illuminate\Database\Query\Builder;
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
        // $user = User::inRandomOrder()->first();
        $program = Programs::inRandomOrder()->first();
        $area = Areas::inRandomOrder()->first();
        return [
            'local_task_force_id' => fake()->unique()->randomNumber(),
            // 'user_id' => $user->user_id,
            'area_id' => $area->area_id,
            'program_id' => $program->program_id,
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'profile_image_name' => fake()->word(),
            'profile_image_path' => fake()->imageUrl(),
        ];
    }
}

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
        return [
            // 'local_task_force_id' => $this->faker->unique()->randomNumber(),
            'area_name' => Areas::inRandomOrder()->first()->area_name,
            /* 'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'profile_image_name' => $this->faker->word(),
            'profile_image_path' => $this->faker->imageUrl(), */
        ];
    }
}

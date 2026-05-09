<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FileStatus>
 */
class FileStatusFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            /* 'file_status_id' => $this->faker->unique()->randomNumber(),
            'status_name' => $this->faker->unique()->word(), */
        ];
    }
}

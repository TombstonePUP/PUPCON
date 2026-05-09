<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vmgo>
 */
class VmgoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            /* 'vmgo_id' => $this->faker->unique()->randomNumber(),
            'vision' => $this->faker->paragraph(),
            'mission' => $this->faker->paragraph(),
            'avp_link' => $this->faker->paragraph(),
            'avp_title' => $this->faker->sentence(),
            'avp_description' => $this->faker->paragraph(), */
        ];
    }
}

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
            'vmgo_id' => fake()->unique()->randomNumber(),
            'vision' => fake()->paragraph(),
            'mission' => fake()->paragraph(),
            'avp_link' => fake()->paragraph(),
            'avp_title' => fake()->sentence(),
            'avp_description' => fake()->paragraph(),
        ];
    }
}

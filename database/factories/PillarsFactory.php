<?php

namespace Database\Factories;

use App\Models\Pillars;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pillars>
 */
class PillarsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            /* 'pillar_id' => $this->faker->unique()->randomNumber(),
            'pillar_title' => $this->faker->word(), */
        ];
    }
}

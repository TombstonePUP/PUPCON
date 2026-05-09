<?php

namespace Database\Factories;

use App\Models\Pillars;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PillarItems>
 */
class PillarItemsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $pillar = Pillars::inRandomOrder()->first();
        return [
            // 'pillar_item_id' => $this->faker->unique()->randomNumber(),
            'pillar_id' => $pillar ? $pillar->pillar_id : null,
            // 'item_description' => $this->faker->paragraph(),
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\Exhibits;
use Illuminate\Database\Query\Builder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ExhibitOutlines>
 */
class ExhibitOutlinesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $exhibit = Exhibits::inRandomOrder()->first();
        return [
            'exhibit_outline_id' => fake()->unique()->randomNumber(),
            'exhibit_id' => $exhibit->exhibit_id,
            'outline_description' => fake()->sentence(),
            'container' => fake()->boolean(),
        ];
    }
}

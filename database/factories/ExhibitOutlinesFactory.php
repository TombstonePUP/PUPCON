<?php

namespace Database\Factories;

use App\Models\ExhibitOutlines;
use App\Models\Exhibits;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ExhibitOutlines>
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
            // 'exhibit_outline_id' => $this->faker->unique()->randomNumber(),
            'exhibit_id' => $exhibit->exhibit_id,
            // 'outline_description' => $this->faker->sentence(),
            'container' => $this->faker->boolean(),
        ];
    }
}

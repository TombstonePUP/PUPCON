<?php

namespace Database\Factories;

use App\Models\Exhibits;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Exhibits>
 */
class ExhibitsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            /* 'exhibit_id' => $this->faker->unique()->randomNumber(),
            'exhibit_name' => $this->faker->word(),
            'container' => $this->faker->boolean(), */
        ];
    }
}

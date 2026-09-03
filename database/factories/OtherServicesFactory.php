<?php

namespace Database\Factories;

use App\Models\OtherServices;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OtherServices>
 */
class OtherServicesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            /* 'service_id' => $this->faker->unique()->randomNumber(),
            'service_link' => $this->faker->sentence(), */
        ];
    }
}

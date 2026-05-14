<?php

namespace Database\Factories;

use App\Models\OrganizationTypes;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrganizationTypes>
 */
class OrganizationTypesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            /* 'type_id' => $this->faker->unique()->randomNumber(),
            'type_name' => $this->faker->word(), */
        ];
    }
}

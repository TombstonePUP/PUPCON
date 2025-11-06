<?php

namespace Database\Factories;

use App\Models\OrganizationTypes;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Organizations>
 */
class OrganizationsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = OrganizationTypes::inRandomOrder()->first();
        return [
            'organization_id' => fake()->unique()->randomNumber(),
            'type_id' => $type ? $type->type_id : null,
            'organization_name' => fake()->company(),
            'affiliation' => fake()->companySuffix(),
        ];
    }
}

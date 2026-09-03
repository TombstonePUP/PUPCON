<?php

namespace Database\Factories;

use App\Models\Organizations;
use App\Models\OrganizationTypes;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Organizations>
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
            // 'organization_id' => $this->faker->unique()->randomNumber(),
            'type_id' => $type ? $type->type_id : null,
            /* 'organization_name' => $this->faker->company(),
            'affiliation' => $this->faker->companySuffix(), */
        ];
    }
}

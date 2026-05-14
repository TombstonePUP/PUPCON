<?php

namespace Database\Factories;

use App\Models\Facilities;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Facilities>
 */
class FacilitiesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Return empty data - will be populated through content management
        return [
            'facility_name' => '',
            'description' => null,
            'image_name' => null,
            'image_path' => null,
        ];
    }
}

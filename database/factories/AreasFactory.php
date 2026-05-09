<?php

namespace Database\Factories;

use App\Models\AccreditationLevels;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Programs;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Areas>
 */
class AreasFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $accreditationLevel = AccreditationLevels::inRandomOrder()->first();
        return [
            // 'area_id' => $this->faker->unique()->randomNumber(),
            'accreditation_level_id' => $accreditationLevel->accreditation_level_id,
            /* 'area_number' => $this->faker->numberBetween(1, 15),
            'area_name' => $this->faker->unique()->word(),
            'area_description' => $this->faker->paragraphs(4, true),
            'area_image_name' => $this->faker->word(), */
            'area_image_path' => null,
            // 'mean' => $this->faker->randomFloat(2, 0, 5),
        ];
    }
}

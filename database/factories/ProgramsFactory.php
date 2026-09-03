<?php

namespace Database\Factories;

use App\Models\Programs;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Programs>
 */
class ProgramsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            /* 'program_id' => $this->faker->unique()->randomNumber(),
            'degree_type' => $this->faker->word(),
            'program_name' => $this->faker->word(),
            'program_description' => $this->faker->paragraphs(4, true),
            'under_survey' => $this->faker->boolean(),
            'program_image_name' => $this->faker->word(),
            'program_image_path' => $this->faker->imageUrl(),
            'color' => $this->faker->colorName(), */
        ];
    }
}

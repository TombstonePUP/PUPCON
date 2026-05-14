<?php

namespace Database\Factories;

use App\Models\CampusDirectors;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CampusDirectors>
 */
class CampusDirectorsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            /* 'director_id' => $this->faker->unique()->randomNumber(),
            'name' => $this->faker->name(),
            'term_start_date' => $this->faker->date(),
            'term_end_date' => $this->faker->date(),
            'description' => $this->faker->paragraphs(4, true),
            'profile_image_name' => $this->faker->word(),
            'profile_image_path' => $this->faker->imageUrl(), */
        ];
    }
}

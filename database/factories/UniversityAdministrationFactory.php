<?php

namespace Database\Factories;

use App\Models\UniversityAdministration;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UniversityAdministration>
 */
class UniversityAdministrationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            /* 'administration_id' => $this->faker->unique()->randomNumber(),
            'first_name' => $this->faker->name(),
            'middle_name' => $this->faker->name(),
            'last_name' => $this->faker->name(),
            'suffix' => $this->faker->suffix(),
            'position' => $this->faker->jobTitle(),
            'profile_image_name' => $this->faker->imageUrl(),
            'profile_image_path' => $this->faker->imageUrl(), */
        ];
    }
}

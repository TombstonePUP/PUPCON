<?php

namespace Database\Factories;

use App\Models\Programs;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FacultyStaff>
 */
class FacultyStaffFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $program = Programs::inRandomOrder()->first();
        return [
            /* 'faculty_staff_id' => $this->faker->unique()->randomNumber(),
            'first_name' => $this->faker->firstName(),
            'middle_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'personnel_type' => $this->faker->randomElement(['Faculty', 'Staff']),
            'status' => $this->faker->randomElement(['Regular', 'Part-Time']), */
            'program_id' => $program ? $program->program_id : null,
            /* 'program_coordinator' => $this->faker->boolean(),
            'image_name' => $this->faker->word(),
            'image_path' => $this->faker->imageUrl(), */
        ];
    }
}

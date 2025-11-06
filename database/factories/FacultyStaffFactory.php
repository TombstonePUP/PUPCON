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
            'faculty_staff_id' => fake()->unique()->randomNumber(),
            'first_name' => fake()->firstName(),
            'middle_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'personnel_type' => fake()->randomElement(['Faculty', 'Staff']),
            'status' => fake()->randomElement(['Regular', 'Part-Time']),
            'program_id' => $program ? $program->program_id : null,
            'program_coordinator' => fake()->boolean(),
            'faculty_image_name' => fake()->word(),
            'faculty_image_path' => fake()->imageUrl(),
        ];
    }
}

<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserProgramRoles>
 */
class UserProgramRolesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_program_role_id' => fake()->randomNumber(),
            'user_id' => UserFactory::new()->create()->user_id,
            'program_id' => ProgramsFactory::new()->create()->program_id,
        ];
    }
}

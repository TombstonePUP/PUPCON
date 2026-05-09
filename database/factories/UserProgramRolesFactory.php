<?php

namespace Database\Factories;

use App\Models\Programs;
use App\Models\User;
use Illuminate\Database\Query\Builder;
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
        $user = User::inRandomOrder()->first();
        $program = Programs::inRandomOrder()->first();
        return [
            // 'user_program_role_id' => $this->faker->unique()->randomNumber(),
            'user_id' => $user->user_id,
            'program_id' => $program->program_id,
        ];
    }
}

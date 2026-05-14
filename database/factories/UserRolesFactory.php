<?php

namespace Database\Factories;

use App\Models\Roles;
use App\Models\User;
use App\Models\UserRoles;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserRoles>
 */
class UserRolesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::inRandomOrder()->first();
        $role = Roles::inRandomOrder()->first();

        return [
            // 'user_role_id' => $this->faker->unique()->randomNumber(),
            'user_id' => $user->user_id,
            'role_id' => $role->role_id,
        ];
    }
}

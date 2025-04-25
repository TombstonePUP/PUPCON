<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserRoles>
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
        return [
            'user_role_id' => fake()->unique()->randomNumber(),
            'user_id' => UserFactory::new()->create()->user_id,
            'role_id' => RolesFactory::new()->create()->role_id,
        ];
    }
}

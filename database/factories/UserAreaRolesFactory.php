<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserAreaRoles>
 */
class UserAreaRolesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_area_role_id' => fake()->randomNumber(),
            'user_role_id' => UserRolesFactory::new()->create()->user_role_id,
            'area_id' => AreasFactory::new()->create()->area_id,
        ];
    }
}

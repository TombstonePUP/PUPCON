<?php

namespace Database\Factories;

use App\Models\Areas;
use App\Models\User;
use App\Models\UserAreaRoles;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserAreaRoles>
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
        $user = User::inRandomOrder()->first();
        $area = Areas::inRandomOrder()->first();

        return [
            // 'user_area_role_id' => $this->faker->unique()->randomNumber(),
            'user_id' => $user->user_id,
            'area_id' => $area->area_id,
        ];
    }
}

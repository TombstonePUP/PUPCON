<?php

namespace Database\Factories;

use App\Models\Areas;
use App\Models\UserRoles;
use Illuminate\Database\Query\Builder;
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
        $userRole = UserRoles::inRandomOrder()->first();
        $area = Areas::inRandomOrder()->first();
        return [
            'user_area_role_id' => fake()->unique()->randomNumber(),
            'user_role_id' => $userRole->user_role_id,
            'area_id' => $area->area_id,
        ];
    }
}

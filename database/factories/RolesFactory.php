<?php

namespace Database\Factories;

use App\Models\Roles;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Roles>
 */
class RolesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Roles::class;
    public function definition(): array
    {
        return [
            /* 'role_id' => $this->faker->unique()->randomNumber(),
            'role_name' => $this->faker->name(), */
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\Areas;
use App\Models\Programs;
use Illuminate\Database\Query\Builder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AreaParameters>
 */
class AreaParametersFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $area = Areas::inRandomOrder()->first();
        return [
            'area_parameter_id' => fake()->unique()->randomNumber(),
            'area_id' => $area->area_id,
            'parameter_name' => fake()->word(),
            'parameter_description' => fake()->sentence(),
            'mean' => fake()->randomFloat(2, 0, 5),
        ];
    }
}

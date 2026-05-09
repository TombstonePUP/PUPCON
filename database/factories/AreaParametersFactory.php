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
            // 'area_parameter_id' => $this->faker->unique()->randomNumber(),
            'area_id' => $area->area_id,
            /* 'parameter_name' => $this->faker->word(),
            'parameter_description' => $this->faker->sentence(),
            'mean' => $this->faker->randomFloat(2, 0, 5), */
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\ProgramGallery;
use App\Models\Programs;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProgramGallery>
 */
class ProgramGalleryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $program = Programs::inRandomOrder()->first();

        return [
            'program_id' => $program->program_id,
            /* 'image_name' => $this->faker->word() . '.jpg',
            'image_path' => 'images/programs/' . $this->faker->word() . '.jpg', */
        ];
    }
}

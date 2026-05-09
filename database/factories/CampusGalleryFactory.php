<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CampusGallery>
 */
class CampusGalleryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            /* 'gallery_id' => $this->faker->unique()->randomNumber(),
            'image_name' => $this->faker->word(),
            'image_path' => $this->faker->imageUrl(),
            'description' => $this->faker->paragraphs(2, true), */
        ];
    }
}

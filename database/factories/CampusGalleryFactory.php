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
            'gallery_id' => fake()->unique()->randomNumber(),
            'image_name' => fake()->word(),
            'image_path' => fake()->imageUrl(),
            'description' => fake()->paragraphs(2, true),
        ];
    }
}

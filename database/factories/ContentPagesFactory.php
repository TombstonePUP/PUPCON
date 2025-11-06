<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ContentPages>
 */
class ContentPagesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'content_page_id' => fake()->unique()->randomNumber(),
            'title' => fake()->sentence(),
            'subtitle' => fake()->sentence(),
            'description' => fake()->paragraphs(4, true),
            'image_name' => fake()->word(),
            'image_path' => fake()->imageUrl(),
            'quote' => fake()->sentence(),
            'author' => fake()->name(),
            'phone_number' => fake()->phoneNumber(),
            'address' => fake()->address(),
        ];
    }
}

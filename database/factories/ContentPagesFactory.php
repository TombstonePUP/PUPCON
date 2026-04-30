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
            'title' => 'Welcome to PUP San Juan',
            'subtitle' => 'The Country\'s First Polytechnic University',
            'description' => 'Polytechnic University of the Philippines San Juan Campus is committed to providing quality education and fostering excellence in various academic fields.',
            'image_name' => 'campus-view',
            'image_path' => '/images/landing/1.jpg',
            'quote' => 'Quality education for all.',
            'author' => 'PUP San Juan Administration',
            'phone_number' => '(02) 8727-2614',
            'address' => 'San Juan, Metro Manila, Philippines',
        ];
    }
}

<?php

namespace Database\Seeders;

use App\Models\ContentPages;
use Illuminate\Database\Seeder;

class PagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $content = [
            [
                'page' => 'Facilities',
            ],
            [
                'page' => 'Administration',
            ],
            [
                'page' => 'About',
            ],
            [
                'page' => 'Local Task Force',
            ],
            [
                'page' => 'Faculty & Staff',
            ],
            [
                'page' => 'History',
            ],
            [
                'page' => 'Vision, Mission & Goals',
            ],
            [
                'page' => 'Other Services',
            ],
            [
                'page' => 'Welcome',
            ],
        ];
        foreach ($content as $attributes) {
            ContentPages::factory()->create($attributes);
        }
    }
}

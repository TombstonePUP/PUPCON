<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('content_pages')
            ->where('page', 'Welcome')
            ->update([
                'video_link' => 'https://www.youtube.com/embed/9ypv1kOj7CU',
                'video_title' => 'PUP San Juan AVP',
                'video_description' => 'A glimpse into the life and achievements of our campus.',
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Optional: Revert to previous link if needed
    }
};

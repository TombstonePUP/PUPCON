<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('campus_directors', function (Blueprint $table) {
            $table->id(column: 'director_id')->autoIncrement()->primary();
            $table->string('name');
            $table->integer('term_start_date');
            $table->integer('term_end_date')->nullable();
            $table->text('description')->nullable();
            $table->string('profile_image_name')->nullable();
            $table->text('profile_image_path')->nullable();
        });

        Schema::create('campus_gallery', function (Blueprint $table) {
            $table->id(column: 'gallery_id')->autoIncrement()->primary();
            $table->text('image_name')->nullable();
            $table->text('image_path')->nullable();
            $table->boolean('carousel')->default(0);
            $table->text('description')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campus_directors');
        Schema::dropIfExists('campus_gallery');
    }
};

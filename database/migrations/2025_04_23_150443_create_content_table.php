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
        Schema::create('news', function (Blueprint $table) {
            $table->id(column: 'news_id')->autoIncrement()->primary();
            $table->string('title');
            $table->text('description');
            $table->text('news_url')->nullable();
            $table->string('image_name')->nullable();
            $table->text('image_path')->nullable();
        });

        Schema::create('about', function (Blueprint $table) {
            $table->id(column: 'about_id')->autoIncrement()->primary();
            $table->text('content');
        });

        Schema::create('facilities', function (Blueprint $table) {
            $table->id(column: 'facility_id')->autoIncrement()->primary();
            $table->string('facility_name');
            $table->text('description');
            $table->text('facility_image_name')->nullable();
            $table->text('facility_image_path')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news');
        Schema::dropIfExists('about');
        Schema::dropIfExists('facilities');
    }
};

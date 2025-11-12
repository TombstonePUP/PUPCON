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

        Schema::create('facilities', function (Blueprint $table) {
            $table->id(column: 'facility_id')->autoIncrement()->primary();
            $table->string('facility_name');
            $table->text('description');
            $table->text('image_name')->nullable();
            $table->text('image_path')->nullable();
        });

        Schema::create('content_pages', function (Blueprint $table) {
            $table->id(column: 'content_page_id')->autoIncrement()->primary();
            $table->string('page');
            $table->text('title')->nullable();
            $table->text('subtitle')->nullable();
            $table->text('description')->nullable();
            $table->text('image_name')->nullable();
            $table->text('image_path')->nullable();
            $table->text('quote')->nullable();
            $table->text('author')->nullable();
            $table->string('phone_number')->nullable();
            $table->text('address')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news');
        Schema::dropIfExists('facilities');
        Schema::dropIfExists('content_pages');
    }
};

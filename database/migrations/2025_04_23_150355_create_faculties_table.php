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
        Schema::create('faculties', function (Blueprint $table) {
            $table->id(column: 'faculty_id')->autoIncrement()->primary();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix')->nullable();
            $table->string('faculty_status');
            $table->foreignId('program_id')->references('program_id')->on('programs')->onUpdate('cascade')->onDelete('cascade');
            $table->string('program_coordinator')->default('false');
            $table->string('faculty_image_name')->nullable();
            $table->text('faculty_image_path')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculties');
    }
};

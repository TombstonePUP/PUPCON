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
        Schema::create('faculty_staff', function (Blueprint $table) {
            $table->id(column: 'faculty_staff_id')->autoIncrement()->primary();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('personnel_type');
            $table->string('status')->nullable();
            $table->foreignId('program_id')->references('program_id')->nullable()->on('programs')->onUpdate('cascade')->onDelete('cascade');
            $table->boolean('program_coordinator')->default('false');
            $table->string('image_name')->nullable();
            $table->text('image_path')->nullable();
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

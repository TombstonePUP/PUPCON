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
        Schema::create('programs', function (Blueprint $table) {
            $table->id(column: 'program_id')->autoIncrement()->primary();
            $table->string('degree_type');
            $table->string('program_name');
            $table->text('program_description')->nullable();
            $table->integer('accreditation_level');
            $table->boolean('under_survey')->default(false);
            $table->string('program_image_name')->nullable();
            $table->text('program_image_path')->nullable();
            $table->text('overview_image_name')->nullable();
            $table->text('overview_image_path')->nullable();
            $table->text('overview_description')->nullable();
            $table->text('page_banner_image_name')->nullable();
            $table->text('page_banner_image_path')->nullable();
        });

        Schema::create('program_objectives', function (Blueprint $table) {
            $table->id(column: 'program_objective_id')->autoIncrement()->primary();
            $table->foreignId('program_id')->references('program_id')->on('programs')->onUpdate('cascade')->onDelete('cascade');
            $table->text('objective_description')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programs');
        Schema::dropIfExists('program_objectives');
    }
};

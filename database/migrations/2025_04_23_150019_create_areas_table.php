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
        Schema::create('areas', function (Blueprint $table) {
            $table->id(column: 'area_id')->autoIncrement()->primary();
            $table->string('area_number')->unique();
            $table->string('area_name');
            $table->string('area_description')->nullable();
            $table->string('area_image_name')->nullable();
            $table->text('area_image_path')->nullable();
        });

        Schema::create('area_parameters', function (Blueprint $table) {
            $table->id(column: 'area_parameter_id')->autoIncrement()->primary();
            $table->foreignId('program_id')->references('program_id')->on('programs')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('area_id')->references('area_id')->on('areas')->onUpdate('cascade')->onDelete('cascade');
            $table->string('parameter_name');
            $table->string('parameter_description')->nullable();
        });

        Schema::create('parameter_outline_category', function (Blueprint $table) {
            $table->id(column: 'parameter_outline_category_id')->autoIncrement()->primary();
            $table->string('category_name')->unique();
        });

        Schema::create('parameter_outlines', function (Blueprint $table) {
            $table->id(column: 'parameter_outline_id')->autoIncrement()->primary();
            // $table->foreignId('area_parameter_id')->constrained()->onDelete('cascade');
            $table->foreignId('area_parameter_id')->references('area_parameter_id')->on('area_parameters')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('parameter_outline_category_id')->nullable()->references('parameter_outline_category_id')->on('parameter_outline_category')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->string('outline_name');
            $table->string('outline_description')->nullable();
        });

        Schema::create('file_status', function (Blueprint $table) {
            $table->id(column: 'file_status_id')->autoIncrement()->primary();
            $table->string('status_name')->unique();
        });

        Schema::create('area_files', function (Blueprint $table) {
            $table->id(column: 'area_file_id')->autoIncrement()->primary();
            $table->foreignId('parameter_outline_id')->references('parameter_outline_id')->on('parameter_outlines')->onUpdate('cascade')->onDelete('cascade');
            $table->string('file_name');
            $table->text('file_path');
            $table->foreignId('file_status_id')->references('file_status_id')->on('file_status')->onUpdate('cascade')->onDelete('cascade');
            $table->text('file_rejection_reason')->nullable();
        });

        Schema::create('exhibits', function (Blueprint $table) {
            $table->id(column: 'exhibit_id')->autoIncrement()->primary();
            $table->string('exhibit_name');
        });

        Schema::create('exhibit_files', function (Blueprint $table) {
            $table->id(column: 'exhibit_file_id')->autoIncrement()->primary();
            $table->foreignId('exhibit_id')->references('exhibit_id')->on('exhibits')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->string('file_name');
            $table->text('file_path');
            $table->foreignId('file_status_id')->references('file_status_id')->on('file_status')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->text('file_rejection_reason')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('areas');
        Schema::dropIfExists('area_parameters');
        Schema::dropIfExists('parameter_outline_category');
        Schema::dropIfExists('parameter_outlines');
        Schema::dropIfExists('file_status');
        Schema::dropIfExists('area_files');
        Schema::dropIfExists('exhibits');
        Schema::dropIfExists('exhibit_files');
    }
};

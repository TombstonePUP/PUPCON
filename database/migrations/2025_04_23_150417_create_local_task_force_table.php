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
        Schema::create('local_task_force', function (Blueprint $table) {
            $table->id(column: 'local_task_force_id')->autoIncrement()->primary();
            $table->string('area_name');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('profile_image_name')->nullable();
            $table->text('profile_image_path')->nullable();
        });

        Schema::create('local_task_force_members', function (Blueprint $table) {
            $table->id(column: 'member_id')->autoIncrement()->primary();
            $table->foreignId('local_task_force_id')->references('local_task_force_id')->on('local_task_force')->onUpdate('cascade')->onDelete('cascade');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('local_task_force');
        Schema::dropIfExists('local_task_force_members');
    }
};

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
        Schema::create('roles', function (Blueprint $table) {
            $table->id(column: 'role_id')->autoIncrement()->primary();
            $table->string('role_name')->unique();
        });

        Schema::create('user_roles', function (Blueprint $table) {
            $table->id(column: 'user_role_id')->autoIncrement()->primary();
            $table->foreignId('user_id')->references('user_id')->on('users')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('role_id')->references('role_id')->on('roles')->onUpdate('cascade')->onDelete('cascade');
        });

        Schema::create('user_program_roles', function (Blueprint $table) {
            $table->id(column: 'user_program_role_id')->autoIncrement()->primary();
            $table->foreignId('user_role_id')->references('user_role_id')->on('user_roles')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('program_id')->references('program_id')->on('programs')->onUpdate('cascade')->onDelete('cascade');
        });

        Schema::create('user_area_roles', function (Blueprint $table) {
            $table->id(column: 'user_area_role_id')->autoIncrement()->primary();
            $table->foreignId('user_role_id')->references('user_role_id')->on('user_roles')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('area_id')->references('area_id')->on('areas')->onUpdate('cascade')->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
        Schema::dropIfExists('user_roles');
        Schema::dropIfExists('user_program_roles');
        Schema::dropIfExists('user_area_roles');
    }
};

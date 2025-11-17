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
        Schema::create('user_area_roles', function (Blueprint $table) {
            $table->id(column: 'user_area_role_id')->autoIncrement()->primary();
            $table->foreignId('user_id')->references('user_id')->on('users')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('area_id')->references('area_id')->on('areas')->onUpdate('cascade')->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_area_roles');
    }
};

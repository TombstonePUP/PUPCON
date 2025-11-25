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
        Schema::create('university_administration', function (Blueprint $table) {
            $table->id(column: 'administration_id')->autoIncrement()->primary();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix')->nullable();
            $table->string('position');
            $table->string('type'); // e.g., 'Campus', 'U-Wide', etc.
            $table->string('profile_picture_name')->nullable();
            $table->text('profile_picture_path')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('university_administration');
    }
};

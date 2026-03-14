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
        Schema::create('activity_log', function (Blueprint $table) {
            $table->id(column: 'activity_log_id')->autoIncrement()->primary();
            $table->foreignId('user_id')->references('user_id')->on('users')->onUpdate('cascade')->onDelete('cascade');
            $table->text('description');
            $table->string('activity');
            $table->string('type');
            $table->timestamp('activity_date');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_log');
    }
};

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
        Schema::create('search', function (Blueprint $table) {
            $table->id(column: 'search_id')->autoIncrement()->primary();
            $table->string('content');
            $table->string('content_type');
            $table->text('content_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('search');
    }
};

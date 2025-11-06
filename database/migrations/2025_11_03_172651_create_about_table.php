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
        Schema::create('organization_types', function (Blueprint $table) {
            $table->id(column: 'type_id')->autoIncrement()->primary();
            $table->string('type_name');
        });

        Schema::create('organizations', function (Blueprint $table) {
            $table->id(column: 'organization_id')->autoIncrement()->primary();
            $table->foreignId('type_id')
                ->references('type_id')
                ->on('organization_types')->onUpdate('cascade')->onDelete('restrict');
            $table->string('organization_name');
            $table->text('affiliation')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organizations');
        Schema::dropIfExists('organization_types');
    }
};

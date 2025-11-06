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
        Schema::create('vmgo', function (Blueprint $table) {
            $table->id(column: 'vmgo_id')->autoIncrement()->primary();
            $table->text('vision')->nullable();
            $table->text('mission')->nullable();
            $table->text('avp_link')->nullable();
            $table->text('avp_title')->nullable();
            $table->text('avp_description')->nullable();
        });

        Schema::create('pillars', function (Blueprint $table) {
            $table->id(column: 'pillar_id')->autoIncrement()->primary();
            $table->string('pillar_title');
        });

        Schema::create('pillar_items', function (Blueprint $table) {
            $table->id(column: 'item_id')->autoIncrement()->primary();
            $table->foreignId('pillar_id')->after('pillar_item_id')->references('pillar_id')->on('pillars')->onUpdate('cascade')->onDelete('restrict');
            $table->text('item_description');
        });

        Schema::create('campus_goals', function (Blueprint $table) {
            $table->id(column: 'goal_id')->autoIncrement()->primary();
            $table->text('goal_title_eng');
            $table->text('goal_desc_eng');
            $table->text('goal_title_fil');
            $table->text('goal_desc_fil');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vmgo');
        Schema::dropIfExists('pillar_items');
        Schema::dropIfExists('pillars');
        Schema::dropIfExists('campus_goals');
    }
};

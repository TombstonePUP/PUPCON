<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
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
            $table->foreignId('accreditation_level_id')->references('accreditation_level_id')->on('accreditation_levels')->onUpdate('cascade')->onDelete('set null')->nullable();
            $table->string('area_number');
            $table->string('area_name');
            $table->text('area_description')->nullable();
            $table->string('area_image_name')->nullable();
            $table->text('area_image_path')->nullable();
        });

        Schema::create('area_form_categories', function (Blueprint $table) {
            $table->id(column: 'area_form_category_id')->autoIncrement()->primary();
            $table->string('category_name')->unique();
        });

        Schema::create('area_parameters', function (Blueprint $table) {
            $table->id(column: 'area_parameter_id')->autoIncrement()->primary();
            $table->foreignId('area_id')->references('area_id')->on('areas')->onUpdate('cascade')->onDelete('cascade');
            $table->string('parameter_name')->nullable();
            $table->string('parameter_description')->nullable();
        });

        Schema::create('parameter_outline_category', function (Blueprint $table) {
            $table->id(column: 'parameter_outline_category_id')->autoIncrement()->primary();
            $table->string('category_name')->unique();
        });

        Schema::create('parameter_outlines', function (Blueprint $table) {
            $table->id(column: 'parameter_outline_id')->autoIncrement()->primary();
            $table->foreignId('area_parameter_id')->references('area_parameter_id')->on('area_parameters')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('parameter_outline_category_id')->nullable()->references('parameter_outline_category_id')
                ->on('parameter_outline_category')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->string('outline_number');
            $table->string('outline_description')->nullable();
            $table->float('item_rating')->default(false);
            /* $table->float('system_implementation_outcome_mean')->default(false);
            $table->float('')->default(false); */
            $table->boolean('container');
        });

        Schema::create('file_status', function (Blueprint $table) {
            $table->id(column: 'file_status_id')->autoIncrement()->primary();
            $table->string('status_name')->unique();
        });

        Schema::create('area_forms', function (Blueprint $table) {
            $table->id(column: 'area_form_id')->autoIncrement()->primary();
            $table->foreignId('area_id')->references('area_id')->on('areas')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('area_form_category_id')->nullable()->references('area_form_category_id')
                ->on('area_form_categories')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->text('form_image_name')->nullable();
            $table->text('form_image_path')->nullable();
            $table->text('file_name')->nullable();
            $table->text('file_path')->nullable();
            $table->foreignId('file_status_id')->nullable()->references('file_status_id')->on('file_status')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->text('file_rejection_reason')->nullable();
        });

        Schema::create('area_files', function (Blueprint $table) {
            $table->id(column: 'area_file_id')->autoIncrement()->primary();
            $table->foreignId('parameter_outline_id')->references('parameter_outline_id')->on('parameter_outlines')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->text('file_name');
            $table->text('file_path');
            /* $table->foreignId('uploaded_by')->references('user_id')->on('users')
                -> onUpdate('cascade')->onDelete('cascade');
            $table->timestamp('uploaded_at')->useCurrent(); */
            $table->foreignId('file_status_id')->references('file_status_id')->on('file_status')
                -> onUpdate('cascade')->onDelete('cascade');
            $table->text('file_rejection_reason')->nullable();
        });

        Schema::create('exhibits', function (Blueprint $table) {
            $table->id(column: 'exhibit_id')->autoIncrement()->primary();
            $table->string('exhibit_name');
        });

        Schema::create('exhibit_outlines', function (Blueprint $table) {
            $table->id(column: 'exhibit_outline_id')->autoIncrement()->primary();
            $table->foreignId('exhibit_id')->references('exhibit_id')->on('exhibits')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->string('outline_description')->nullable();
            $table->boolean('container');
        });

        Schema::create('exhibit_files', function (Blueprint $table) {
            $table->id(column: 'exhibit_file_id')->autoIncrement()->primary();
            $table->foreignId('exhibit_outline_id')->references('exhibit_outline_id')->on('exhibit_outlines')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->text('file_name');
            $table->text('file_path');
            $table->foreignId('file_status_id')->references('file_status_id')->on('file_status')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->text('file_rejection_reason')->nullable();
        });

        DB::statement(<<<SQL
            CREATE VIEW public.files_overview AS
            SELECT
                CONCAT('Area', '-', a.area_number, '-','Parameter', '-', ap.parameter_name) file_type, -- area_name and parameter_name
                po.outline_description outline,
                af.area_file_id file_id,
                af.file_name file_name,
                af.file_path file_path,
                fs.status_name file_status,
                af.file_rejection_reason rejection_reason
            FROM area_files af
                LEFT JOIN parameter_outlines po ON po.parameter_outline_id = af.parameter_outline_id
                LEFT JOIN area_parameters ap ON ap.area_parameter_id = po.area_parameter_id
                LEFT JOIN areas a ON a.area_id = ap.area_id
                LEFT JOIN file_status fs ON fs.file_status_id = af.file_status_id
            UNION ALL
            SELECT
                'area-forms' file_type,
                CONCAT(a.area_name,'-', afc.category_name) outline,
                afo.area_form_id file_id,
                afo.file_name file_name,
                afo.file_path file_path,
                fs.status_name file_status,
                afo.file_rejection_reason rejection_reason
            FROM area_forms afo
                LEFT JOIN area_form_categories afc on afc.area_form_category_id = afo.area_form_category_id
                LEFT JOIN areas a ON a.area_id = afo.area_id
                LEFT JOIN file_status fs ON fs.file_status_id = afo.file_status_id
            UNION ALL
            SELECT
                'exhibits' file_type,
                eo.outline_description outline,
                ef.exhibit_file_id file_id,
                ef.file_name file_name,
                ef.file_path file_path,
                fs.status_name file_status,
                ef.file_rejection_reason rejection_reason
            FROM exhibit_files ef
                LEFT JOIN exhibit_outlines eo ON eo.exhibit_outline_id = ef.exhibit_outline_id
                LEFT JOIN file_status fs ON fs.file_status_id = ef.file_status_id
        SQL);

        /* DB::statement('CREATE INDEX idx_files_overview_status ON public.files_overview (file_status)');
        DB::statement('CREATE INDEX idx_files_overview_outlines ON public.files_overview (outline)');
        DB::statement('CREATE INDEX idx_files_overview_type ON public.files_overview (file_type)'); */
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
        Schema::dropIfExists('exhibit_outlines');
        Schema::dropIfExists('exhibit_files');
        DB::statement('DROP VIEW IF EXISTS files_overview');
    }
};

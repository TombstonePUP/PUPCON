<?php

use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Files\AreaFilesController;
use App\Http\Controllers\Files\AreaFormFilesController;
use App\Http\Controllers\Files\AreaFormsController;
use App\Http\Controllers\Parameters\AreaParameterOutlinesController;
use App\Http\Controllers\Programs\ManageProgramController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'update.password', 'user.accreditor.restriction'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::controller(ManageProgramController::class)->prefix('manage-programs')->as('manage.')->group(function () {
        Route::get('/', 'index')->name('manage-programs');

        Route::middleware(['user.program.role'])->group(function () {
            Route::get('/{program_name}/{level_id}/', 'show')->name('program')->middleware('program.level.exists');
            Route::prefix('{program_name}/{level_id}')->group(function () {

                Route::middleware(['user.area.role'])->group(function () {
                    Route::get('/{area_id}', [AreaParameterOutlinesController::class, 'index'])->name('area');

                    Route::as('area.')->prefix('/{area_id}')->group(function () {
                        Route::controller(AreaFilesController::class)->group(function () {
                            Route::get('/{outline_id}/download_file', 'download')->name('download.file');
                            Route::post('/upload_file', 'store')->name('upload.file');
                            Route::delete('/{outline_id}/delete_file', 'destroy')->name('delete.file');
                        });

                        Route::controller(AreaFormsController::class)->group(function () {
                            Route::post('/add_form', 'store')->name('add.area.form');
                            Route::delete('/{form_id}/delete_form', 'destroy')->name('delete.area.form');
                        });

                        Route::controller(AreaFormFilesController::class)->group(function () {
                            Route::get('/{form_id}/download_file_form', 'download')->name('download.area.form.file');
                            Route::post('/{form_id}/upload_file_form', 'store')->name('upload.area.form.file');
                            Route::delete('/{form_id}/delete_area_form_file', 'destroy')->name('delete.area.form.file');
                        });
                    });
                });
            });
        });
    });
});

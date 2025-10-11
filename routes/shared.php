<?php

use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Files\AreaFilesController;
use App\Http\Controllers\Files\AreaFormsController;
use App\Http\Controllers\Files\AreaParameterController;
use App\Http\Controllers\Files\AreaParameterOutlinesController;
use App\Http\Controllers\Programs\ManageProgramController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'update.password'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::controller(ManageProgramController::class)->prefix('manage-programs')->as('manage.')->group(function () {
        Route::get('/', 'show')->name('manage-programs');

        Route::middleware(['user.program.role'])->group(function () {
            Route::get('/{program_name}', 'index')->name('program');

            Route::middleware(['user.program.role'])->group(function () {
                Route::controller(AreaFilesController::class)->prefix('{program_name}')->group(function () {
                    Route::get('/{area_id}', 'index')->name('area');

                    Route::middleware(['admin'])->group(function () {
                        Route::controller(AreaParameterController::class)->group(function () {
                            Route::post('/{area_id}/storeParameter', 'store')->name('area.addParameter');
                            Route::patch('/{area_id}/{parameter_id}/updateParameter', 'update')->name('area.updateParameter');
                            Route::delete('/{area_id}/{parameter_id}/deleteParameter', 'destroy')->name('area.deleteParameter');
                        });
                    });

                    Route::controller(AreaParameterOutlinesController::class)->group(function () {
                        Route::post('/{area_id}/storeBenchmark', 'store')->name('area.add.benchmark');
                        Route::patch('/{area_id}/{outline_id}/updateBenchmark', 'update')->name('area.update.benchmark');
                        Route::delete('/{area_id}/{outline_id}/deleteBenchmark', 'destroy')->name('area.delete.benchmark');
                    });

                    Route::controller(AreaFilesController::class)->group(function () {
                        Route::post('/{area_id}/uploadFile', 'store')->name('area.upload.file');
                        Route::delete('/{area_id}/{outline_id}/deleteFile', 'destroy')->name('area.delete.file');
                    });

                    Route::controller(AreaFormsController::class)->group(function () {
                        Route::post('/{area_id}/storeForm', 'store')->name('area.addAreaForm');
                        Route::post('/{area_id}/{form_id}/updateForm', 'update')->name('area.updateAreaForm');
                        Route::delete('/{area_id}/{form_id}/deleteForm', 'destroy')->name('area.deleteAreaForm');
                    });
                });
            });
        });
    });
});

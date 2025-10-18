<?php

use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Files\AreaFilesController;
use App\Http\Controllers\Files\AreaFormsController;
use App\Http\Controllers\Files\AreaParameterController;
use App\Http\Controllers\Files\AreaParameterOutlinesController;
use App\Http\Controllers\Programs\ManageProgramController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'update.password', 'user.accreditor.restriction'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::controller(ManageProgramController::class)->prefix('manage-programs')->as('manage.')->group(function () {
        Route::get('/', 'show')->name('manage-programs');

        Route::middleware(['user.program.role'])->group(function () {
            Route::get('/{program_name}', 'index')->name('program');

            Route::middleware(['user.program.role'])->group(function () {
                Route::prefix('{program_name}')->group(function () {
                    Route::get('/{area_id}', [AreaParameterOutlinesController::class, 'index'])->name('area');

                    Route::as('area.')->group(function () {
                        Route::controller(AreaFilesController::class)->group(function () {
                            Route::post('/{area_id}/uploadFile', 'store')->name('upload.file');
                            Route::delete('/{area_id}/{outline_id}/deleteFile', 'destroy')->name('delete.file');
                        });

                        Route::controller(AreaFormsController::class)->group(function () {
                            Route::post('/{area_id}/storeForm', 'store')->name('addAreaForm');
                            Route::post('/{area_id}/{form_id}/updateForm', 'update')->name('updateAreaForm');
                            Route::delete('/{area_id}/{form_id}/deleteForm', 'destroy')->name('deleteAreaForm');
                        });
                    });
                });
            });
        });
    });
});

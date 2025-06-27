<?php

use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Files\AreaFilesController;
use App\Http\Controllers\Files\AreaFormsController;
use App\Http\Controllers\Files\AreaParameterController;
use App\Http\Controllers\Files\AreaParameterOutlinesController;
use App\Http\Controllers\Files\DocumentRequestController;
use App\Http\Controllers\Programs\ManageProgramController;
use App\Http\Controllers\Users\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::middleware(['admin'])->group(function () {

        Route::get('users', [UserController::class, 'index'])
            ->name('users');

        Route::get('manage-exhibits', function () {
            return Inertia::render('document/exhibits');
        })->name('manage-exhibits');

        Route::controller(DocumentRequestController::class)->prefix('requests')->group(function () {
            Route::get('/', 'index')->name('requests');
            Route::post('/{file_id}/approveDocument', 'approve')->name('approveDocument');
            Route::post('/{file_id}/rejectDocument', 'reject')->name('rejectDocument');
            Route::post('/{file_id}/revertDocument', 'revert')->name('revertDocument');
        });
    });


    Route::middleware(['userProgramRole'])->group(function () {
        Route::controller(ManageProgramController::class)->prefix('manage-programs')->as('manage.')->group(function () {

            Route::get('/{program_name}', 'index')->name('program');
            Route::get('/', 'show')->name('manage-programs');

            Route::middleware(['userAreaRole'])->group(function () {
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
                        Route::post('/{area_id}/storeOutline', 'store')->name('area.addOutline');
                        Route::post('/{area_id}/{outline_id}/updateOutline', 'update')->name('area.updateOutline');
                        Route::delete('/{area_id}/{outline_id}/deleteOutline', 'destroy')->name('area.deleteOutline');
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

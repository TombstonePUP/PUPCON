<?php

use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Files\AreaFilesController;
use App\Http\Controllers\Files\AreaParameterController;
use App\Http\Controllers\Programs\ManageProgramController;
use App\Http\Controllers\Users\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

     Route::get('manage-programs/program', function () {
        return Inertia::render('content/program');
    })->name('program_name');

    Route::get('manage-programs', function () {
        return Inertia::render('manage-programs');
    })->name('manage-programs');

    Route::controller(ManageProgramController::class)->prefix('manage-program')->as('manage.')->group(function () {
        Route::get('/{program_name}', 'index')->name('program');
        Route::controller(AreaFilesController::class)->prefix('{program_name}')->group(function () {
            Route::get('/{area_id}', 'index')->name('area');
            Route::controller(AreaParameterController::class)->group(function () {
                Route::post('/{area_id}/store', 'store')->name('area.addParameter');
                Route::patch('/{area_id}/{parameter_id}/update', 'update')->name('area.updateParameter');
                Route::delete('/{area_id}/{parameter_id}/delete', 'destroy')->name('area.deleteParameter');
            });
        });
    });

    // Route::get('/document/program/area', function () {
    //     return Inertia::render('document/area');
    // })->name('area');
    Route::get('users', [UserController::class, 'index'])
        ->name('users');
});

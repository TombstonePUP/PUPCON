<?php

use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Files\AreaFilesController;
use App\Http\Controllers\Programs\ManageProgramController;
use App\Http\Controllers\Users\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::controller(ManageProgramController::class)->prefix('manage_program')->as('manage.')->group(function () {
        Route::get('/{program_name}', 'index')->name('program');
        Route::controller(AreaFilesController::class)->prefix('{program_name}')->as('program.area.')->group(function () {
            Route::get('/{area_name}', 'index')->name('index');
        });
    });

    // Route::get('/document/program/area', function () {
    //     return Inertia::render('document/area');
    // })->name('area');
   Route::get('users', [UserController::class, 'index'])
       ->name('users');
});


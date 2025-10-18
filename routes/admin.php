<?php

use App\Http\Controllers\Files\DocumentRequestController;
use App\Http\Controllers\Files\AreaParameterController;
use App\Http\Controllers\Files\AreaParameterOutlinesController;
use App\Http\Controllers\Users\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware(['auth', 'verified', 'update.password', 'admin'])->group(function () {
    Route::controller(UserController::class)->group(function () {
        Route::get('users', 'index')->name('users');
        Route::post('users', 'store')->name('users.store');
        Route::patch('users/updatePrivileges', 'updateUserPrivileges')->name('users.update.roles');
        Route::patch('users/disable', 'disable')->name('users.disable');
        Route::patch('users/enable', 'enable')->name('users.enable');
    });

    Route::get('manage-exhibits', function () {
        return Inertia::render('document/exhibits');
    })->name('manage-exhibits');

    Route::get('ratings', function () {
        return Inertia::render('document/ratings');
    })->name('ratings'); 

    Route::prefix('manage-programs/{program_name}/{area_id}')->as('manage.')->group(function () {
        Route::controller(AreaParameterController::class)->group(function () {
            Route::post('/storeParameter', 'store')->name('area.addParameter');
            Route::patch('/{parameter_id}/updateParameter', 'update')->name('area.updateParameter');
            Route::delete('/{parameter_id}/deleteParameter', 'destroy')->name('area.deleteParameter');
        });

        Route::controller(AreaParameterOutlinesController::class)->group(function () {
            Route::post('/storeBenchmark', 'store')->name('area.add.benchmark');
            Route::patch('/{outline_id}/editBenchmark', 'edit')->name('area.edit.benchmark');
            Route::delete('/{outline_id}/deleteBenchmark', 'destroy')->name('area.delete.benchmark');
        });
    });

    Route::controller(DocumentRequestController::class)->prefix('requests')->group(function () {
        Route::get('/', 'index')->name('requests');
        Route::post('/{file_id}/approveDocument', 'approve')->name('approveDocument');
        Route::post('/{file_id}/rejectDocument', 'reject')->name('rejectDocument');
        Route::post('/{file_id}/revertDocument', 'revert')->name('revertDocument');
    });
});

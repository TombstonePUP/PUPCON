<?php

use App\Http\Controllers\Content\ContentController;
use App\Http\Controllers\Content\FacilitiesController;
use App\Http\Controllers\Files\DocumentRequestController;
use App\Http\Controllers\Parameters\AreaParameterController;
use App\Http\Controllers\Parameters\AreaParameterOutlinesController;
use App\Http\Controllers\Parameters\ImportParametersController;
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

     Route::get('/other-services', function () {
        return Inertia::render('content-management/other-services');
    })->name('other.services');

    Route::prefix('manage-programs/{program_name}/{level_id}/{area_id}')->as('manage.')->group(function () {
        Route::controller(ImportParametersController::class)->group(function () {
            Route::get('/download_parameter_template', 'download')->name('area.download.template');
            Route::post('/import_parameters', 'import')->name('area.import.parameters');
        });
        Route::controller(AreaParameterController::class)->group(function () {
            Route::post('/store_parameter', 'store')->name('area.add.parameter');
            Route::patch('/{parameter_id}/update_parameter', 'update')->name('area.update.parameter');
            Route::delete('/{parameter_id}/delete_parameter', 'destroy')->name('area.delete.parameter');
        });

        Route::controller(AreaParameterOutlinesController::class)->group(function () {
            Route::post('/store_benchmark', 'store')->name('area.add.benchmark');
            Route::patch('/{outline_id}/edit_benchmark', 'edit')->name('area.edit.benchmark');
            Route::delete('/{outline_id}/delete_benchmark', 'destroy')->name('area.delete.benchmark');
        });
    });

    Route::controller(DocumentRequestController::class)->prefix('requests')->group(function () {
        Route::get('/', 'index')->name('requests');
        Route::post('/{file_id}/approveDocument', 'approve')->name('approveDocument');
        Route::post('/{file_id}/rejectDocument', 'reject')->name('rejectDocument');
        Route::post('/{file_id}/revertDocument', 'revert')->name('revertDocument');
    });

    Route::get('main-content/', ContentController::class)->name('content.main');
    Route::post('main-content/facilities/update', FacilitiesController::class)->name('content.facilities.update');
});

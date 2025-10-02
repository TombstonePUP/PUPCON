<?php

use App\Http\Controllers\Files\DocumentRequestController;
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

    Route::controller(DocumentRequestController::class)->prefix('requests')->group(function () {
        Route::get('/', 'index')->name('requests');
        Route::post('/{file_id}/approveDocument', 'approve')->name('approveDocument');
        Route::post('/{file_id}/rejectDocument', 'reject')->name('rejectDocument');
        Route::post('/{file_id}/revertDocument', 'revert')->name('revertDocument');
    });
});

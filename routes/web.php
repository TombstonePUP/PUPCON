<?php

use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Users\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/programs', function () {
    return Inertia::render('programs');
})->name('programs');

Route::get('/programs/programview', function () {
    return Inertia::render('programview');
});

Route::get('/programs/programview/area', function () {
    return Inertia::render('area');
});

Route::middleware(['auth', 'verified'])->group(function () {
    /* Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard'); */
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');
    Route::get('/document/program', function () {
        return Inertia::render('document/program');
    })->name('Program');
   Route::get('users', [UserController::class, 'index'])
       ->name('users');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

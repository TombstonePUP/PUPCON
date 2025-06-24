<?php

use App\Http\Controllers\Guest\AreasController;
use App\Http\Controllers\Guest\ProgramsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('exhibits', function () {
    return Inertia::render('exhibits');
})->name('exhibits');

Route::controller(ProgramsController::class)->prefix('programs')->group(function () {
    Route::get('/', 'index')->name('programs.index');
    Route::get('/{program_name}', 'show')->name('programs.show');
});

Route::get('/programs/{program_name}/{area_id}', AreasController::class)
    ->name('programs.areas.show');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/shared.php';

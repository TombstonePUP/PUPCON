<?php

use App\Http\Controllers\Guest\AreasController;
use App\Http\Controllers\Guest\ProgramsController;
use App\Http\Controllers\Guest\FacultyController;
use App\Http\Controllers\LandingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', LandingController::class)->name('home');

Route::get('about', function () {
    return Inertia::render('about/about');
})->name('about');

Route::get('about/vision-mission-goals', function () {
    return Inertia::render('about/vmgo');
})->name('vmgo');

Route::get('about/history', function () {
    return Inertia::render('about/history');
})->name('history');

Route::get('about/administration', function () {
    return Inertia::render('about/admin');
})->name('administration');

Route::get('about/facilities', function () {
    return Inertia::render('about/facilities');
})->name('facilities');

Route::get('about/faculty-and-staff', [FacultyController::class, 'index'])
     ->name('faculty-and-staff');

Route::get('about/local-task-force', function () {
    return Inertia::render('about/local-task-force');
})->name('local-task-force');

Route::get('exhibits', function () {
    return Inertia::render('exhibits');
})->name('exhibits');

Route::get('certificate', function () {
    return Inertia::render('certificate');
})->name('certificate');

Route::get('others', function () {
    return Inertia::render('others');
})->name('others');

Route::controller(ProgramsController::class)->prefix('programs')->group(function () {
    Route::get('/', 'index')->name('programs.index');
    Route::get('/{program_name}', 'show')->name('programs.show');
});

Route::get('/programs/{program_name}/{area_id}', AreasController::class)
    ->name('programs.areas.show');



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/shared.php';
require __DIR__ . '/accreditor.php';

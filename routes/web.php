<?php

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

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/shared.php';

<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FacebookController;

Route::middleware(['api'])->group(function () {
    Route::get('/updates', [FacebookController::class, 'feed']);
});
<?php

use App\Http\Controllers\Api\FacebookController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api'])->group(function () {
    Route::get('/updates', [FacebookController::class, 'feed']);
});

<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FacebookController;

Route::get('/facebook-feed', [FacebookController::class, 'feed']);
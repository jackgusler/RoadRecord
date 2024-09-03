<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LicensePlateController;

// Public routes
Route::post('/auth/sign-in', [AuthController::class, 'signIn']);
Route::post('/auth/sign-up', [AuthController::class, 'signUp']);
Route::get('/license-plates', [LicensePlateController::class, 'index']);
Route::get('/license-plates/search', [LicensePlateController::class, 'search']);

// Protected routes
Route::group(['middleware' => ['jwt.auth']], function () {
    Route::post('/auth/sign-out', [AuthController::class, 'signOut']);
    Route::post('/auth/status', [AuthController::class, 'status']);

    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    Route::get('/license-plates/{state}', [LicensePlateController::class, 'getByState']);
    Route::get('/license-plates/{id}', [LicensePlateController::class, 'show']);
});
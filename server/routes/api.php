<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

// Public routes
Route::post('/auth/sign-in', [AuthController::class, 'signIn']);
Route::post('/auth/sign-up', [AuthController::class, 'signUp']);

// Protected routes
Route::group(['middleware' => ['jwt.auth']], function () {
    Route::post('/auth/sign-out', [AuthController::class, 'signOut']);
    Route::post('/auth/status', [AuthController::class, 'status']);

    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});
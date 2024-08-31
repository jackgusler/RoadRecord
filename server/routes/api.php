<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::get('/users', [UserController::class, 'index']);     // Get all users
Route::get('/users/{id}', [UserController::class, 'show']); // Get a specific user
Route::post('/users', [UserController::class, 'store']);    // Create a new user
Route::put('/users/{id}', [UserController::class, 'update']); // Update a user
Route::delete('/users/{id}', [UserController::class, 'destroy']); // Delete a user
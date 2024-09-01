<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::get('/', [UserController::class, 'index']);     // Get all users
Route::get('{id}', [UserController::class, 'show']);   // Get a specific user
Route::put('{id}', [UserController::class, 'update']); // Update a user
Route::delete('{id}', [UserController::class, 'destroy']); // Delete a user
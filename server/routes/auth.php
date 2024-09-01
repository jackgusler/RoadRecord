<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

Route::post('/sign-in', [AuthController::class, 'signIn']); // Sign in a user
Route::post('/sign-up', [AuthController::class, 'signUp']); // Sign up a user
Route::post('/sign-out', [AuthController::class, 'signOut']); // Sign out a user
Route::post('/status', [AuthController::class, 'status']); // Check if a user is signed in
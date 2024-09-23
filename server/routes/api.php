<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LicensePlateController;
use App\Http\Controllers\UserLicensePlateController;

// Public routes
Route::post('/auth/sign-in', [AuthController::class, 'signIn']);
Route::post('/auth/sign-up', [AuthController::class, 'signUp']);

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/auth/sign-out', [AuthController::class, 'signOut']);
    Route::post('/auth/status', [AuthController::class, 'status']);

    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/current', [UserController::class, 'current']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::patch('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    Route::get('/license-plates', [LicensePlateController::class, 'index']);
    Route::get('/license-plates/search', [LicensePlateController::class, 'search']);
    Route::get('/license-plates/state/{state}', [LicensePlateController::class, 'getByState']);
    Route::get('/license-plates/id/{id}', [LicensePlateController::class, 'show']);
    Route::get('/license-plates/user/{userId}', [LicensePlateController::class, 'getByUser']);

    Route::get('/user/{userId}/license-plates', [UserLicensePlateController::class, 'getLicensePlatesByUser']);
    Route::get('/user/license-plate/{id}', [UserLicensePlateController::class, 'getUserLicensePlate']);
    Route::post('/license-plate/batch-update', [UserLicensePlateController::class, 'batchUpdate']);
    Route::post('/license-plate/{id}/favorite', [UserLicensePlateController::class, 'favoriteLicensePlate']);
    Route::post('/license-plate/{id}/unfavorite', [UserLicensePlateController::class, 'unfavoriteLicensePlate']);
    Route::post('/license-plate/{id}/seen', [UserLicensePlateController::class, 'seenLicensePlate']);
    Route::delete('/license-plate/{id}/unseen', [UserLicensePlateController::class, 'unseenLicensePlate']);
});

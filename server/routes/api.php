<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LicensePlateController;
use App\Http\Controllers\UserLicensePlateController;
use App\Http\Controllers\TripController;

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

    Route::get('/license-plates', [LicensePlateController::class, 'getAllLicensePlates']);
    Route::get('/license-plates/search', [LicensePlateController::class, 'searchLicensePlates']);
    Route::get('/license-plates/id/{id}', [LicensePlateController::class, 'getLicensePlateById']);
    Route::get('/license-plates/state/{state}', [LicensePlateController::class, 'getLicensePlatesByState']);

    Route::get('/user/license-plates', [UserLicensePlateController::class, 'getLicensePlatesByUser']);
    Route::get('/user/license-plates/details', [UserLicensePlateController::class, 'getLicensePlatesDetailsByUser']);
    Route::get('/user/license-plates/states', [UserLicensePlateController::class, 'getLicensePlatesStateByUser']);
    Route::get('/user/license-plates/details/state/{state}', [UserLicensePlateController::class, 'getLicensePlatesDetailsByUserAndState']);
    Route::get('/user/license-plates/{id}', [UserLicensePlateController::class, 'getUserLicensePlateById']);
    Route::post('/user/license-plates/{id}/favorite', [UserLicensePlateController::class, 'favoriteUserLicensePlate']);
    Route::post('/user/license-plates/{id}/unfavorite', [UserLicensePlateController::class, 'unfavoriteUserLicensePlate']);
    Route::post('/user/license-plates/{id}/seen', [UserLicensePlateController::class, 'seenUserLicensePlate']);
    Route::post('/user/license-plates/{id}/unseen', [UserLicensePlateController::class, 'unseenUserLicensePlate']);
    Route::post('/user/license-plates/batch-update', [UserLicensePlateController::class, 'batchUpdateUserLicensePlates']);

    Route::get('/trips', [TripController::class, 'getTripsByUser']);
    Route::get('/trips/{id}', [TripController::class, 'getTripById']);
    Route::post('/trips', [TripController::class, 'createTrip']);
    Route::patch('/trips/{id}', [TripController::class, 'updateTrip']);
    Route::patch('/trips/{id}/start', [TripController::class, 'startTrip']);
    Route::patch('/trips/{id}/end', [TripController::class, 'endTrip']);
    Route::delete('/trips/{id}', [TripController::class, 'deleteTrip']);
});

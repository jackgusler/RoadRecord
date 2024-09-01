<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Route to return CSRF token
Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->mapApiRoutes();
        $this->mapWebRoutes();
    }

    protected function mapApiRoutes()
    {
        Route::prefix('api')
            ->middleware('api')
            ->group(function () {
                Route::prefix('auth')->middleware('web')->group(base_path('routes/auth.php')); // Apply 'web' middleware to auth routes
                Route::prefix('users')->group(base_path('routes/users.php'));
            });
    }

    protected function mapWebRoutes()
    {
        Route::middleware('web')
            ->group(function () {
                Route::group([], base_path('routes/web.php'));
            });
    }
}
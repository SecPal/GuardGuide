<?php

use App\Http\Controllers\OrganizationalUnitController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('organizational-units', [OrganizationalUnitController::class, 'index'])
        ->name('organizational-units.index');
    Route::post('organizational-units', [OrganizationalUnitController::class, 'store'])
        ->name('organizational-units.store');
    Route::put('organizational-units/{organizationalUnit}', [OrganizationalUnitController::class, 'update'])
        ->name('organizational-units.update');
});

require __DIR__.'/settings.php';

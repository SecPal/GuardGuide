<?php

use App\Http\Controllers\OrganizationalUnitController;
use App\Http\Controllers\UserAssignmentController;
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

    Route::get('user-assignments', [UserAssignmentController::class, 'redirectToFirstUser'])
        ->name('user-assignments.redirect');
    Route::get('users/{user}/assignments', [UserAssignmentController::class, 'index'])
        ->name('user-assignments.index');
    Route::post('users/{user}/assignments/organizational-units', [UserAssignmentController::class, 'storeOrganizationalUnit'])
        ->name('user-assignments.organizational-units.store');
    Route::delete('users/{user}/assignments/organizational-units/{organizationalUnit}', [UserAssignmentController::class, 'destroyOrganizationalUnit'])
        ->name('user-assignments.organizational-units.destroy');
    Route::post('users/{user}/assignments/customers', [UserAssignmentController::class, 'storeCustomer'])
        ->name('user-assignments.customers.store');
    Route::delete('users/{user}/assignments/customers/{customer}', [UserAssignmentController::class, 'destroyCustomer'])
        ->name('user-assignments.customers.destroy');
    Route::post('users/{user}/assignments/sites', [UserAssignmentController::class, 'storeSite'])
        ->name('user-assignments.sites.store');
    Route::delete('users/{user}/assignments/sites/{site}', [UserAssignmentController::class, 'destroySite'])
        ->name('user-assignments.sites.destroy');
});

require __DIR__.'/settings.php';

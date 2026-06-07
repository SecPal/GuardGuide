<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\OrganizationalUnitController;
use App\Http\Controllers\UserAssignmentController;
use App\Http\Controllers\UserRoleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

$manifest = function (Request $request) {
    $appearance = $request->query('appearance');
    $usesDarkAppearance = $appearance === 'dark';

    $iconPrefix = $usesDarkAppearance ? 'guardguide-dark' : 'guardguide';
    $maskableIconPrefix = $usesDarkAppearance ? 'guardguide-maskable-dark' : 'guardguide-maskable';
    $themeColor = $usesDarkAppearance ? '#011B2E' : '#FFFFFF';
    $appName = (string) config('app.name', 'GuardGuide');

    return response()->json([
        'name' => $appName,
        'short_name' => $appName,
        'description' => 'GuardGuide by SecPal',
        'start_url' => '/',
        'scope' => '/',
        'display' => 'standalone',
        'theme_color' => $themeColor,
        'background_color' => $themeColor,
        'icons' => [
            [
                'src' => "/icons/{$iconPrefix}-192.png",
                'sizes' => '192x192',
                'type' => 'image/png',
            ],
            [
                'src' => "/icons/{$iconPrefix}-512.png",
                'sizes' => '512x512',
                'type' => 'image/png',
            ],
            [
                'src' => "/icons/{$maskableIconPrefix}-512.png",
                'sizes' => '512x512',
                'type' => 'image/png',
                'purpose' => 'maskable',
            ],
        ],
    ])->header('Content-Type', 'application/manifest+json');
};

Route::get('manifest.webmanifest', $manifest)->name('manifest');
Route::get('site.webmanifest', $manifest);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('organizational-units', [OrganizationalUnitController::class, 'index'])
        ->name('organizational-units.index');
    Route::post('organizational-units', [OrganizationalUnitController::class, 'store'])
        ->name('organizational-units.store');
    Route::put('organizational-units/{organizationalUnit}', [OrganizationalUnitController::class, 'update'])
        ->name('organizational-units.update');

    Route::get('customers', [CustomerController::class, 'index'])
        ->name('customers.index');
    Route::post('customers', [CustomerController::class, 'store'])
        ->name('customers.store');
    Route::put('customers/{customer}', [CustomerController::class, 'update'])
        ->name('customers.update');

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

    Route::get('user-roles', [UserRoleController::class, 'redirectToFirstUser'])
        ->name('user-roles.redirect');
    Route::get('users/{user}/roles', [UserRoleController::class, 'index'])
        ->name('user-roles.index');
    Route::post('users/{user}/roles', [UserRoleController::class, 'store'])
        ->name('user-roles.store');
    Route::delete('users/{user}/roles/{role}', [UserRoleController::class, 'destroy'])
        ->name('user-roles.destroy');
});

require __DIR__.'/settings.php';

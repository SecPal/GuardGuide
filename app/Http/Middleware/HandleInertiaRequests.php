<?php

namespace App\Http\Middleware;

use App\Auth\GuardGuideAccessCatalog;
use App\Models\Customer;
use App\Models\Site;
use App\Services\UserContextResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
                'can' => $this->sharedPermissions($request),
            ],
            'effectiveContext' => fn () => $request->user() === null
                ? null
                : app(UserContextResolver::class)->resolve($request->user()),
            'locale' => App::getLocale(),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }

    /**
     * @return array{organizationalUnits: array{view: bool}, customers: array{view: bool}, sites: array{view: bool}, userAssignments: array{view: bool}, userRoles: array{view: bool}}
     */
    private function sharedPermissions(Request $request): array
    {
        $user = $request->user();

        return [
            'organizationalUnits' => [
                'view' => $user?->can(GuardGuideAccessCatalog::ORGANIZATIONAL_UNITS_VIEW) ?? false,
            ],
            'customers' => [
                'view' => $user?->can('viewAny', Customer::class) ?? false,
            ],
            'sites' => [
                'view' => $user?->can('viewAny', Site::class) ?? false,
            ],
            'userAssignments' => [
                'view' => $user?->can(GuardGuideAccessCatalog::USER_ASSIGNMENTS_VIEW) ?? false,
            ],
            'userRoles' => [
                'view' => $user?->can(GuardGuideAccessCatalog::USER_ROLES_VIEW) ?? false,
            ],
        ];
    }
}

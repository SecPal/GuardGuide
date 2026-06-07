<?php

namespace App\Providers;

use App\Auth\RolePermissionSource;
use App\Models\Customer;
use App\Models\OrganizationalUnit;
use App\Models\Site;
use App\Models\User;
use App\Policies\CustomerPolicy;
use App\Policies\OrganizationalUnitPolicy;
use App\Policies\SitePolicy;
use App\Policies\UserAssignmentPolicy;
use App\Services\UserContextResolver;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use InvalidArgumentException;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->scoped(UserContextResolver::class);
        $this->app->scoped(RolePermissionSource::class, function (): RolePermissionSource {
            $sourceName = config('guardguide_access.source', 'local');
            $sources = config('guardguide_access.sources', []);
            $sourceClass = is_array($sources) && is_string($sourceName) ? ($sources[$sourceName] ?? null) : null;

            if (! is_string($sourceClass) || ! is_subclass_of($sourceClass, RolePermissionSource::class)) {
                throw new InvalidArgumentException(sprintf(
                    'GuardGuide access source [%s] must be configured as a %s implementation.',
                    is_scalar($sourceName) ? (string) $sourceName : 'unknown',
                    RolePermissionSource::class,
                ));
            }

            $source = app($sourceClass);

            if (! $source instanceof RolePermissionSource) {
                throw new InvalidArgumentException(sprintf(
                    'GuardGuide access source [%s] did not resolve to a %s implementation.',
                    $sourceName,
                    RolePermissionSource::class,
                ));
            }

            return $source;
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configurePolicies();
    }

    protected function configurePolicies(): void
    {
        Gate::policy(Customer::class, CustomerPolicy::class);
        Gate::policy(OrganizationalUnit::class, OrganizationalUnitPolicy::class);
        Gate::policy(Site::class, SitePolicy::class);
        Gate::policy(User::class, UserAssignmentPolicy::class);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}

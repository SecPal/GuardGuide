<?php

use App\Auth\GuardGuideAccessCatalog;
use App\Auth\RolePermissionSource;
use App\Auth\Sources\LocalGuardGuideRolePermissionSource;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\GuardGuideAccessSeeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

test('standalone access source resolves to the local guardguide catalog by default', function () {
    $source = app(RolePermissionSource::class);

    expect(config('guardguide_access.source'))->toBe('local')
        ->and($source)->toBeInstanceOf(LocalGuardGuideRolePermissionSource::class)
        ->and($source->guardName())->toBe(GuardGuideAccessCatalog::GUARD)
        ->and($source->permissions())->toBe(GuardGuideAccessCatalog::permissions())
        ->and($source->roles())->toBe(GuardGuideAccessCatalog::roles());
});

test('guardguide access seeder creates the documented permission catalog', function () {
    $this->seed(GuardGuideAccessSeeder::class);

    foreach (array_keys(GuardGuideAccessCatalog::permissions()) as $permissionName) {
        $permission = Permission::findByName($permissionName, GuardGuideAccessCatalog::GUARD);

        expect($permission->guard_name)->toBe(GuardGuideAccessCatalog::GUARD);
    }

    expect(Permission::count())->toBe(count(GuardGuideAccessCatalog::permissions()));
});

test('guardguide access seeder is idempotent', function () {
    $this->seed(GuardGuideAccessSeeder::class);

    $permissionCount = Permission::count();
    $roleCount = Role::count();
    $rolePermissionCount = DB::table('role_has_permissions')->count();

    $this->seed(GuardGuideAccessSeeder::class);

    expect(Permission::count())->toBe($permissionCount)
        ->and(Role::count())->toBe($roleCount)
        ->and(DB::table('role_has_permissions')->count())->toBe($rolePermissionCount);
});

test('predefined guardguide roles receive their expected permissions', function () {
    $this->seed(GuardGuideAccessSeeder::class);

    foreach (GuardGuideAccessCatalog::roles() as $roleName => $roleDefinition) {
        $role = Role::findByName($roleName, GuardGuideAccessCatalog::GUARD);

        expect($role->guard_name)->toBe(GuardGuideAccessCatalog::GUARD)
            ->and($role->permissions->pluck('name')->sort()->values()->all())
            ->toBe(collect($roleDefinition['permissions'])->sort()->values()->all());
    }
});

test('guardguide access seeder promotes legacy admins to the platform administrator role', function () {
    $legacyAdmin = User::factory()->create([
        'is_admin' => true,
    ]);

    $this->seed(GuardGuideAccessSeeder::class);

    expect($legacyAdmin->refresh()->hasRole(GuardGuideAccessCatalog::ROLE_PLATFORM_ADMINISTRATOR))
        ->toBeTrue()
        ->and($legacyAdmin->can(GuardGuideAccessCatalog::USER_ASSIGNMENTS_MANAGE))
        ->toBeTrue();
});

test('database seeder includes guardguide standard roles', function () {
    $this->seed(DatabaseSeeder::class);

    $testUser = User::where('email', 'test@example.com')->firstOrFail();

    expect(Role::findByName(GuardGuideAccessCatalog::ROLE_PLATFORM_ADMINISTRATOR, GuardGuideAccessCatalog::GUARD)
        ->hasPermissionTo(GuardGuideAccessCatalog::USER_ASSIGNMENTS_MANAGE))
        ->toBeTrue()
        ->and($testUser->hasRole(GuardGuideAccessCatalog::ROLE_PLATFORM_ADMINISTRATOR))
        ->toBeTrue()
        ->and($testUser->can(GuardGuideAccessCatalog::USER_ASSIGNMENTS_MANAGE))
        ->toBeTrue();
});

test('legacy admins retain access until the permission catalog has been seeded', function () {
    $legacyAdmin = User::factory()->create([
        'is_admin' => true,
    ]);

    expect($legacyAdmin->can(GuardGuideAccessCatalog::USER_ASSIGNMENTS_MANAGE))
        ->toBeTrue()
        ->and($legacyAdmin->can(GuardGuideAccessCatalog::ORGANIZATIONAL_UNITS_UPDATE))
        ->toBeTrue();
});

test('database seeder promotes legacy admins to the platform administrator role', function () {
    $legacyAdmin = User::factory()->create([
        'is_admin' => true,
    ]);

    $this->seed(DatabaseSeeder::class);

    expect($legacyAdmin->refresh()->hasRole(GuardGuideAccessCatalog::ROLE_PLATFORM_ADMINISTRATOR))
        ->toBeTrue()
        ->and($legacyAdmin->is_admin)
        ->toBeFalse()
        ->and($legacyAdmin->can(GuardGuideAccessCatalog::USER_ASSIGNMENTS_MANAGE))
        ->toBeTrue();
});

test('database seeder does not re-grant the platform administrator role after backfilling the legacy flag', function () {
    app()->instance('env', 'production');

    $legacyAdmin = User::factory()->create([
        'is_admin' => true,
    ]);

    $this->seed(DatabaseSeeder::class);

    $legacyAdmin->refresh()->removeRole(GuardGuideAccessCatalog::ROLE_PLATFORM_ADMINISTRATOR);

    $this->seed(DatabaseSeeder::class);

    expect($legacyAdmin->refresh()->hasRole(GuardGuideAccessCatalog::ROLE_PLATFORM_ADMINISTRATOR))
        ->toBeFalse()
        ->and($legacyAdmin->is_admin)
        ->toBeFalse();
});

test('access seeder reads role and permission definitions from the configured source', function () {
    config()->set('guardguide_access.source', 'test');
    config()->set('guardguide_access.sources.test', TestRolePermissionSource::class);

    app()->forgetInstance(RolePermissionSource::class);

    $this->seed(GuardGuideAccessSeeder::class);

    $role = Role::findByName('test-role', 'web');

    expect(Permission::pluck('name')->all())->toBe(['test.permission'])
        ->and($role->permissions->pluck('name')->all())->toBe(['test.permission']);
});

final class TestRolePermissionSource implements RolePermissionSource
{
    public function guardName(): string
    {
        return GuardGuideAccessCatalog::GUARD;
    }

    /**
     * @return array<string, string>
     */
    public function permissions(): array
    {
        return [
            'test.permission' => 'Test permission supplied by configured source.',
        ];
    }

    /**
     * @return array<string, array{name: string, permissions: list<string>}>
     */
    public function roles(): array
    {
        return [
            'test-role' => [
                'name' => 'Test role',
                'permissions' => ['test.permission'],
            ],
        ];
    }
}

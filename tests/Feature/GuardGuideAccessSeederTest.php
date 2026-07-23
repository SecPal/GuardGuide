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
use Tests\Fixtures\Auth\TestRolePermissionSource;

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
            ->and($role->label)->toBe($roleDefinition['name'])
            ->and($role->permissions->pluck('name')->sort()->values()->all())
            ->toBe(collect($roleDefinition['permissions'])->sort()->values()->all());
    }
});

test('guardguide access seeder adds newly introduced catalog permissions to existing roles on reseed', function () {
    $this->seed(GuardGuideAccessSeeder::class);

    $role = Role::findByName(
        GuardGuideAccessCatalog::ROLE_PLATFORM_ADMINISTRATOR,
        GuardGuideAccessCatalog::GUARD,
    );

    $originalPermissionNames = $role->permissions->pluck('name')->all();

    // Remove one catalog permission from the role to simulate it being absent
    // (e.g. because it was added to the catalog after the initial seed).
    $removedPermission = Permission::findByName(
        GuardGuideAccessCatalog::ROLES_VIEW,
        GuardGuideAccessCatalog::GUARD,
    );
    $role->revokePermissionTo($removedPermission);

    expect($role->refresh()->hasPermissionTo(GuardGuideAccessCatalog::ROLES_VIEW))->toBeFalse();

    $this->seed(GuardGuideAccessSeeder::class);

    expect($role->refresh()->hasPermissionTo(GuardGuideAccessCatalog::ROLES_VIEW))->toBeTrue()
        ->and($role->permissions->pluck('name')->sort()->values()->all())
        ->toBe(collect($originalPermissionNames)->sort()->values()->all());
});

test('guardguide access seeder preserves edits to predefined roles when reseeded', function () {
    $this->seed(GuardGuideAccessSeeder::class);

    $role = Role::findByName(
        GuardGuideAccessCatalog::ROLE_OPERATIONS_USER,
        GuardGuideAccessCatalog::GUARD,
    );
    $permission = Permission::findByName(
        GuardGuideAccessCatalog::CUSTOMERS_DELETE,
        GuardGuideAccessCatalog::GUARD,
    );

    $role->forceFill([
        'label' => 'Custom operations',
    ])->save();
    $role->givePermissionTo($permission);

    $this->seed(GuardGuideAccessSeeder::class);

    expect($role->refresh()->label)->toBe('Custom operations')
        ->and($role->permissions->pluck('name')->contains(GuardGuideAccessCatalog::CUSTOMERS_DELETE))
        ->toBeTrue();
});

test('guardguide access seeder promotes legacy admins to the platform administrator role', function () {
    $legacyAdmin = User::factory()->create([
        'is_admin' => true,
    ]);

    $this->seed(GuardGuideAccessSeeder::class);

    expect($legacyAdmin->refresh()->hasRole(GuardGuideAccessCatalog::ROLE_PLATFORM_ADMINISTRATOR))
        ->toBeTrue()
        ->and($legacyAdmin->is_admin)
        ->toBeFalse()
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
        ->toBeTrue()
        ->and($testUser->email_verified_at)
        ->not->toBeNull();
});

test('database seeder can be run repeatedly', function () {
    $this->seed(DatabaseSeeder::class);

    $this->seed(DatabaseSeeder::class);

    expect(User::where('email', 'test@example.com')->count())->toBe(1);
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

<?php

use App\Auth\GuardGuideAccessCatalog;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\GuardGuideAccessSeeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

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

test('database seeder includes guardguide standard roles', function () {
    $this->seed(DatabaseSeeder::class);

    expect(Role::findByName(GuardGuideAccessCatalog::ROLE_PLATFORM_ADMINISTRATOR, GuardGuideAccessCatalog::GUARD)
        ->hasPermissionTo(GuardGuideAccessCatalog::USER_ASSIGNMENTS_MANAGE))
        ->toBeTrue();
});

<?php

namespace Database\Seeders;

use App\Auth\GuardGuideAccessCatalog;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class GuardGuideAccessSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        /** @var array<string, Permission> $permissions */
        $permissions = [];

        foreach (array_keys(GuardGuideAccessCatalog::permissions()) as $permissionName) {
            $permission = Permission::firstOrCreate([
                'name' => $permissionName,
                'guard_name' => GuardGuideAccessCatalog::GUARD,
            ]);

            $permissions[$permissionName] = $permission;
        }

        foreach (GuardGuideAccessCatalog::roles() as $roleName => $roleDefinition) {
            $role = Role::firstOrCreate([
                'name' => $roleName,
                'guard_name' => GuardGuideAccessCatalog::GUARD,
            ]);

            $role->syncPermissions(array_map(
                static fn (string $permissionName): Permission => $permissions[$permissionName],
                $roleDefinition['permissions'],
            ));
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}

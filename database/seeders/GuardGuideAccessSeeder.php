<?php

namespace Database\Seeders;

use App\Auth\GuardGuideAccessCatalog;
use App\Auth\RolePermissionSource;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class GuardGuideAccessSeeder extends Seeder
{
    public function __construct(private readonly RolePermissionSource $source) {}

    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        /** @var array<string, Permission> $permissions */
        $permissions = [];

        foreach (array_keys($this->source->permissions()) as $permissionName) {
            $permission = Permission::firstOrCreate([
                'name' => $permissionName,
                'guard_name' => $this->source->guardName(),
            ]);

            $permissions[$permissionName] = $permission;
        }

        foreach ($this->source->roles() as $roleName => $roleDefinition) {
            $role = Role::firstOrCreate([
                'name' => $roleName,
                'guard_name' => $this->source->guardName(),
            ]);

            $role->syncPermissions(array_map(
                static fn (string $permissionName): Permission => $permissions[$permissionName],
                $roleDefinition['permissions'],
            ));
        }

        $platformAdministrator = Role::query()
            ->where('name', GuardGuideAccessCatalog::ROLE_PLATFORM_ADMINISTRATOR)
            ->where('guard_name', $this->source->guardName())
            ->first();

        if ($platformAdministrator !== null) {
            User::query()
                ->where('is_admin', true)
                ->cursor()
                ->each(fn (User $user) => $user->assignRole($platformAdministrator));
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}

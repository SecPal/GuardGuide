<?php

namespace App\Policies;

use App\Auth\GuardGuideAccessCatalog;
use App\Models\User;
use Spatie\Permission\Models\Role;

class RoleManagementPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(GuardGuideAccessCatalog::ROLES_VIEW);
    }

    public function create(User $user): bool
    {
        return $user->can(GuardGuideAccessCatalog::ROLES_CREATE);
    }

    public function updateAny(User $user): bool
    {
        return $user->can(GuardGuideAccessCatalog::ROLES_UPDATE);
    }

    public function update(User $user, Role $role): bool
    {
        return $role->guard_name === GuardGuideAccessCatalog::GUARD
            && $user->can(GuardGuideAccessCatalog::ROLES_UPDATE);
    }

    public function deleteAny(User $user): bool
    {
        return $user->can(GuardGuideAccessCatalog::ROLES_DELETE);
    }

    public function delete(User $user, Role $role): bool
    {
        return $role->guard_name === GuardGuideAccessCatalog::GUARD
            && $user->can(GuardGuideAccessCatalog::ROLES_DELETE);
    }
}

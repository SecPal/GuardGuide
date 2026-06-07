<?php

namespace App\Policies;

use App\Auth\GuardGuideAccessCatalog;
use App\Models\User;

class UserAssignmentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(GuardGuideAccessCatalog::USER_ASSIGNMENTS_VIEW);
    }

    public function manage(User $user, User $target): bool
    {
        return $user->can(GuardGuideAccessCatalog::USER_ASSIGNMENTS_MANAGE);
    }

    public function viewRoles(User $user, User $target): bool
    {
        return $user->can(GuardGuideAccessCatalog::USER_ROLES_VIEW);
    }

    public function manageRoles(User $user, User $target): bool
    {
        return $user->can(GuardGuideAccessCatalog::USER_ROLES_MANAGE);
    }
}

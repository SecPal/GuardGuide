<?php

namespace App\Policies;

use App\Auth\GuardGuideAccessCatalog;
use App\Models\OrganizationalUnit;
use App\Models\User;

class OrganizationalUnitPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(GuardGuideAccessCatalog::ORGANIZATIONAL_UNITS_VIEW);
    }

    public function create(User $user): bool
    {
        return $user->can(GuardGuideAccessCatalog::ORGANIZATIONAL_UNITS_CREATE);
    }

    public function update(User $user, OrganizationalUnit $organizationalUnit): bool
    {
        return $user->can(GuardGuideAccessCatalog::ORGANIZATIONAL_UNITS_UPDATE);
    }
}

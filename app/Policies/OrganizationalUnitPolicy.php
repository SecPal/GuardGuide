<?php

namespace App\Policies;

use App\Models\OrganizationalUnit;
use App\Models\User;

class OrganizationalUnitPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, OrganizationalUnit $organizationalUnit): bool
    {
        return $user->isAdmin();
    }
}

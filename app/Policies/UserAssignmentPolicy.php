<?php

namespace App\Policies;

use App\Models\User;

class UserAssignmentPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function manage(User $user, User $target): bool
    {
        return true;
    }
}

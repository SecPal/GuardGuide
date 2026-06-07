<?php

namespace App\Policies;

use App\Auth\GuardGuideAccessCatalog;
use App\Models\Site;
use App\Models\User;
use App\Services\AssignmentAccessScope;

class SitePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(GuardGuideAccessCatalog::SITES_VIEW)
            || app(AssignmentAccessScope::class)->readableSites($user)->exists();
    }

    public function create(User $user): bool
    {
        return $user->can(GuardGuideAccessCatalog::SITES_CREATE);
    }

    public function update(User $user, Site $site): bool
    {
        if (! $user->can(GuardGuideAccessCatalog::SITES_UPDATE)) {
            return false;
        }

        return app(AssignmentAccessScope::class)
            ->writableCustomers($user)
            ->whereKey($site->customer_id)
            ->exists();
    }
}

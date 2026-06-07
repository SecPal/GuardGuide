<?php

namespace App\Policies;

use App\Auth\GuardGuideAccessCatalog;
use App\Models\Customer;
use App\Models\User;
use App\Services\AssignmentAccessScope;

class CustomerPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(GuardGuideAccessCatalog::CUSTOMERS_VIEW)
            || app(AssignmentAccessScope::class)->readableCustomers($user)->exists();
    }

    public function create(User $user): bool
    {
        return $user->can(GuardGuideAccessCatalog::CUSTOMERS_CREATE);
    }

    public function update(User $user, Customer $customer): bool
    {
        return app(AssignmentAccessScope::class)->canWriteCustomer($user, $customer);
    }
}

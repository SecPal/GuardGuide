<?php

namespace App\Services;

use App\Auth\GuardGuideAccessCatalog;
use App\Models\Customer;
use App\Models\OrganizationalUnit;
use App\Models\Site;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class AssignmentAccessScope
{
    /**
     * @return Builder<OrganizationalUnit>
     */
    public function readableOrganizationalUnits(User $user): Builder
    {
        $query = OrganizationalUnit::query();

        if ($user->can(GuardGuideAccessCatalog::ORGANIZATIONAL_UNITS_VIEW)) {
            return $query;
        }

        return $query->where(function (Builder $query) use ($user) {
            $query->whereHas('userAssignments', fn (Builder $query) => $query->where('user_id', $user->getKey()))
                ->orWhereHas('sites.userAssignments', fn (Builder $query) => $query->where('user_id', $user->getKey()));
        });
    }

    /**
     * @return Builder<OrganizationalUnit>
     */
    public function writableOrganizationalUnits(User $user): Builder
    {
        $query = OrganizationalUnit::query();

        if ($user->can(GuardGuideAccessCatalog::ORGANIZATIONAL_UNITS_UPDATE)) {
            return $query;
        }

        return $query->whereHas('userAssignments', fn (Builder $query) => $query->where('user_id', $user->getKey()));
    }

    public function canReadOrganizationalUnit(User $user, OrganizationalUnit $unit): bool
    {
        return $this->readableOrganizationalUnits($user)
            ->whereKey($unit->getKey())
            ->exists();
    }

    public function canWriteOrganizationalUnit(User $user, OrganizationalUnit $unit): bool
    {
        return $this->writableOrganizationalUnits($user)
            ->whereKey($unit->getKey())
            ->exists();
    }

    /**
     * @return Builder<Customer>
     */
    public function readableCustomers(User $user): Builder
    {
        $query = Customer::query();

        if ($user->can(GuardGuideAccessCatalog::CUSTOMERS_VIEW)) {
            return $query;
        }

        return $query->where(function (Builder $query) use ($user) {
            $query->whereHas('userAssignments', fn (Builder $query) => $query->where('user_id', $user->getKey()))
                ->orWhereHas('sites.userAssignments', fn (Builder $query) => $query->where('user_id', $user->getKey()));
        });
    }

    /**
     * @return Builder<Customer>
     */
    public function writableCustomers(User $user): Builder
    {
        $query = Customer::query();

        if ($user->can(GuardGuideAccessCatalog::CUSTOMERS_UPDATE)) {
            return $query;
        }

        return $query->whereHas('userAssignments', fn (Builder $query) => $query->where('user_id', $user->getKey()));
    }

    public function canReadCustomer(User $user, Customer $customer): bool
    {
        return $this->readableCustomers($user)
            ->whereKey($customer->getKey())
            ->exists();
    }

    public function canWriteCustomer(User $user, Customer $customer): bool
    {
        return $this->writableCustomers($user)
            ->whereKey($customer->getKey())
            ->exists();
    }

    /**
     * @return Builder<Site>
     */
    public function readableSites(User $user): Builder
    {
        $query = Site::query();

        if ($user->can(GuardGuideAccessCatalog::SITES_VIEW)) {
            return $query;
        }

        return $query->whereHas('userAssignments', fn (Builder $query) => $query->where('user_id', $user->getKey()));
    }

    /**
     * @return Builder<Site>
     */
    public function writableSites(User $user): Builder
    {
        $query = Site::query();

        if (! $user->can(GuardGuideAccessCatalog::SITES_UPDATE)) {
            return $query->whereKey([]);
        }

        return $query->whereIn(
            'customer_id',
            $this->writableCustomers($user)->select('id'),
        );
    }

    public function canReadSite(User $user, Site $site): bool
    {
        return $this->readableSites($user)
            ->whereKey($site->getKey())
            ->exists();
    }

    public function canWriteSite(User $user, Site $site): bool
    {
        return $this->writableSites($user)
            ->whereKey($site->getKey())
            ->exists();
    }
}

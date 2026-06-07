<?php

namespace App\Services;

use App\Auth\GuardGuideAccessCatalog;
use App\Enums\OrganizationalUnitType;
use App\Models\Customer;
use App\Models\OrganizationalUnit;
use App\Models\Site;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

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
     * @return Collection<int, OrganizationalUnit>
     */
    public function writableCustomerOrganizationalUnits(User $user): Collection
    {
        if ($user->can(GuardGuideAccessCatalog::ORGANIZATIONAL_UNITS_UPDATE)) {
            return OrganizationalUnit::query()
                ->select(['id', 'type', 'name', 'parent_id', 'sort_order'])
                ->where('type', OrganizationalUnitType::Company->value)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get();
        }

        $assignedUnitIds = $this->writableOrganizationalUnits($user)
            ->pluck('organizational_units.id')
            ->all();

        if ($assignedUnitIds === []) {
            return collect();
        }

        $units = OrganizationalUnit::query()
            ->select(['id', 'type', 'name', 'parent_id', 'sort_order'])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        $unitsByParent = [];

        foreach ($units as $unit) {
            if ($unit->parent_id === null) {
                continue;
            }

            $unitsByParent[$unit->parent_id] ??= [];
            $unitsByParent[$unit->parent_id][] = $unit;
        }

        $descendantIds = [];
        $queue = array_values(array_unique($assignedUnitIds));

        while ($queue !== []) {
            $currentId = array_shift($queue);

            if (! is_string($currentId) || isset($descendantIds[$currentId])) {
                continue;
            }

            $descendantIds[$currentId] = true;

            foreach ($unitsByParent[$currentId] ?? [] as $childUnit) {
                $queue[] = $childUnit->getKey();
            }
        }

        return $units
            ->filter(fn (OrganizationalUnit $unit): bool => isset($descendantIds[$unit->getKey()]))
            ->filter(fn (OrganizationalUnit $unit): bool => $unit->type === OrganizationalUnitType::Company)
            ->values();
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

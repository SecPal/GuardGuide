<?php

namespace App\Services;

use App\Enums\OrganizationalUnitType;
use App\Models\Customer;
use App\Models\OrganizationalUnit;
use App\Models\Site;
use App\Models\User;
use Illuminate\Support\Collection;

class UserContextResolver
{
    /**
     * @return array{
     *     organizationalUnits: list<array{id: string, type: string, name: string, parent_id: string|null, sources: list<string>}>,
     *     customers: list<array{id: string, name: string, sources: list<string>}>,
     *     sites: list<array{id: string, customer_id: string, customer_name: string|null, organizational_unit_id: string|null, organizational_unit_name: string|null, name: string, sources: list<string>}>
     * }
     */
    public function resolve(User $user): array
    {
        $assignedOrganizationalUnits = $user->organizationalUnits()
            ->select(['organizational_units.id', 'type', 'name', 'parent_id'])
            ->orderBy('name')
            ->get();

        $assignedCustomers = $user->customers()
            ->select(['customers.id', 'name'])
            ->orderBy('name')
            ->get();

        $assignedSites = $user->sites()
            ->with([
                'customer:id,name',
                'organizationalUnit:id,type,name,parent_id',
            ])
            ->select(['sites.id', 'customer_id', 'organizational_unit_id', 'name'])
            ->orderBy('name')
            ->get();

        return [
            'organizationalUnits' => $this->organizationalUnits($assignedOrganizationalUnits, $assignedSites),
            'customers' => $this->customers($assignedCustomers, $assignedSites),
            'sites' => $this->sites($assignedSites),
        ];
    }

    /**
     * @param  Collection<int, OrganizationalUnit>  $assignedOrganizationalUnits
     * @param  Collection<int, Site>  $assignedSites
     * @return list<array{id: string, type: string, name: string, parent_id: string|null, sources: list<string>}>
     */
    private function organizationalUnits(Collection $assignedOrganizationalUnits, Collection $assignedSites): array
    {
        $contexts = [];

        $assignedOrganizationalUnits->each(function (OrganizationalUnit $unit) use (&$contexts) {
            $this->upsertOrganizationalUnit($contexts, $unit, 'assigned');
        });

        $assignedSites->each(function (Site $site) use (&$contexts) {
            if ($site->organizationalUnit !== null) {
                $this->upsertOrganizationalUnit($contexts, $site->organizationalUnit, 'site');
            }
        });

        $contexts = array_values($contexts);

        usort($contexts, fn (array $left, array $right): int => $left['name'] <=> $right['name']);

        return $contexts;
    }

    /**
     * @param  array<string, array{id: string, type: string, name: string, parent_id: string|null, sources: list<string>}>  $contexts
     */
    private function upsertOrganizationalUnit(array &$contexts, OrganizationalUnit $unit, string $source): void
    {
        $id = (string) $unit->getKey();
        $context = $contexts[$id] ?? [
            'id' => $id,
            'type' => $this->typeLabel($unit->type),
            'name' => $unit->name,
            'parent_id' => $unit->parent_id,
            'sources' => [],
        ];

        $context['sources'] = $this->appendSource($context['sources'], $source);
        $contexts[$id] = $context;
    }

    /**
     * @param  Collection<int, Customer>  $assignedCustomers
     * @param  Collection<int, Site>  $assignedSites
     * @return list<array{id: string, name: string, sources: list<string>}>
     */
    private function customers(Collection $assignedCustomers, Collection $assignedSites): array
    {
        $contexts = [];

        $assignedCustomers->each(function (Customer $customer) use (&$contexts) {
            $this->upsertCustomer($contexts, $customer, 'assigned');
        });

        $assignedSites->each(function (Site $site) use (&$contexts) {
            if ($site->customer !== null) {
                $this->upsertCustomer($contexts, $site->customer, 'site');
            }
        });

        $contexts = array_values($contexts);

        usort($contexts, fn (array $left, array $right): int => $left['name'] <=> $right['name']);

        return $contexts;
    }

    /**
     * @param  array<string, array{id: string, name: string, sources: list<string>}>  $contexts
     */
    private function upsertCustomer(array &$contexts, Customer $customer, string $source): void
    {
        $id = (string) $customer->getKey();
        $context = $contexts[$id] ?? [
            'id' => $id,
            'name' => $customer->name,
            'sources' => [],
        ];

        $context['sources'] = $this->appendSource($context['sources'], $source);
        $contexts[$id] = $context;
    }

    /**
     * @param  Collection<int, Site>  $assignedSites
     * @return list<array{id: string, customer_id: string, customer_name: string|null, organizational_unit_id: string|null, organizational_unit_name: string|null, name: string, sources: list<string>}>
     */
    private function sites(Collection $assignedSites): array
    {
        return $assignedSites
            ->map(fn (Site $site): array => [
                'id' => (string) $site->getKey(),
                'customer_id' => $site->customer_id,
                'customer_name' => $site->customer?->name,
                'organizational_unit_id' => $site->organizationalUnit?->getKey(),
                'organizational_unit_name' => $site->organizationalUnit?->name,
                'name' => $site->name,
                'sources' => ['assigned'],
            ])
            ->values()
            ->all();
    }

    /**
     * @param  list<string>  $sources
     * @return list<string>
     */
    private function appendSource(array $sources, string $source): array
    {
        if (! in_array($source, $sources, true)) {
            $sources[] = $source;
        }

        sort($sources);

        return $sources;
    }

    private function typeLabel(OrganizationalUnitType|string $type): string
    {
        if ($type instanceof OrganizationalUnitType) {
            return $type->label();
        }

        return $type;
    }
}

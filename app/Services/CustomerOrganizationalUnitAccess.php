<?php

namespace App\Services;

use App\Models\OrganizationalUnit;
use App\Models\User;
use Illuminate\Support\Collection;

class CustomerOrganizationalUnitAccess
{
    public function __construct(
        private readonly AssignmentAccessScope $accessScope,
    ) {}

    /**
     * @return array{
     *     options: list<array{id: string, name: string}>,
     *     resolvedOrganizationId: string|null,
     *     mustChooseOrganization: bool,
     *     organizationSelectionLocked: bool
     * }
     */
    public function forUser(User $user): array
    {
        $units = $this->accessScope->writableCustomerOrganizationalUnits($user);
        $options = $units
            ->map(fn (OrganizationalUnit $unit): array => [
                'id' => $unit->getKey(),
                'name' => $unit->name,
            ])
            ->values()
            ->all();

        $resolvedOrganizationId = count($options) === 1
            ? $options[0]['id']
            : null;

        return [
            'options' => $options,
            'resolvedOrganizationId' => $resolvedOrganizationId,
            'mustChooseOrganization' => count($options) > 1,
            'organizationSelectionLocked' => count($options) === 1,
        ];
    }

    /**
     * @return Collection<int, OrganizationalUnit>
     */
    public function unitsForUser(User $user): Collection
    {
        return $this->accessScope->writableCustomerOrganizationalUnits($user);
    }
}

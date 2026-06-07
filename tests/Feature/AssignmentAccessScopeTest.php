<?php

use App\Auth\GuardGuideAccessCatalog;
use App\Enums\OrganizationalUnitType;
use App\Models\Customer;
use App\Models\OrganizationalUnit;
use App\Models\Site;
use App\Models\User;
use App\Models\UserCustomerAssignment;
use App\Models\UserOrganizationalUnitAssignment;
use App\Models\UserSiteAssignment;
use App\Services\AssignmentAccessScope;

test('users without global permissions can write assigned customers but only read directly assigned sites', function () {
    $user = User::factory()->create();
    $assignedCustomer = Customer::factory()->create(['name' => 'Assigned Customer']);
    $unassignedCustomer = Customer::factory()->create(['name' => 'Unassigned Customer']);
    $assignedSite = Site::factory()
        ->forCustomer($assignedCustomer)
        ->create(['name' => 'Assigned Site']);
    $unassignedSite = Site::factory()
        ->forCustomer($assignedCustomer)
        ->create(['name' => 'Unassigned Site']);

    UserCustomerAssignment::factory()
        ->forUser($user)
        ->forCustomer($assignedCustomer)
        ->create();
    UserSiteAssignment::factory()
        ->forUser($user)
        ->forSite($assignedSite)
        ->create();

    $scope = app(AssignmentAccessScope::class);

    expect($scope->readableCustomers($user)->pluck('id')->all())->toBe([$assignedCustomer->getKey()])
        ->and($scope->writableCustomers($user)->pluck('id')->all())->toBe([$assignedCustomer->getKey()])
        ->and($scope->readableSites($user)->pluck('id')->all())->toBe([$assignedSite->getKey()])
        ->and($scope->writableSites($user)->pluck('id')->all())->toBe([])
        ->and($scope->canReadCustomer($user, $assignedCustomer))->toBeTrue()
        ->and($scope->canWriteCustomer($user, $assignedCustomer))->toBeTrue()
        ->and($scope->canReadCustomer($user, $unassignedCustomer))->toBeFalse()
        ->and($scope->canWriteCustomer($user, $unassignedCustomer))->toBeFalse()
        ->and($scope->canReadSite($user, $assignedSite))->toBeTrue()
        ->and($scope->canWriteSite($user, $assignedSite))->toBeFalse()
        ->and($scope->canReadSite($user, $unassignedSite))->toBeFalse()
        ->and($scope->canWriteSite($user, $unassignedSite))->toBeFalse();
});

test('site assignments provide read scope for parent customers and responsible organizational units only', function () {
    $user = User::factory()->create();
    $responsibleUnit = OrganizationalUnit::factory()->create(['name' => 'Responsible Unit']);
    $otherUnit = OrganizationalUnit::factory()->create(['name' => 'Other Unit']);
    $siteCustomer = Customer::factory()->create(['name' => 'Site Customer']);
    $otherCustomer = Customer::factory()->create(['name' => 'Other Customer']);
    $site = Site::factory()
        ->forCustomer($siteCustomer)
        ->managedBy($responsibleUnit)
        ->create(['name' => 'Assigned Object']);

    UserSiteAssignment::factory()
        ->forUser($user)
        ->forSite($site)
        ->create();

    $scope = app(AssignmentAccessScope::class);

    expect($scope->readableCustomers($user)->pluck('id')->all())->toBe([$siteCustomer->getKey()])
        ->and($scope->writableCustomers($user)->pluck('id')->all())->toBe([])
        ->and($scope->readableOrganizationalUnits($user)->pluck('id')->all())->toBe([$responsibleUnit->getKey()])
        ->and($scope->writableOrganizationalUnits($user)->pluck('id')->all())->toBe([])
        ->and($scope->canReadCustomer($user, $siteCustomer))->toBeTrue()
        ->and($scope->canWriteCustomer($user, $siteCustomer))->toBeFalse()
        ->and($scope->canReadCustomer($user, $otherCustomer))->toBeFalse()
        ->and($scope->canReadOrganizationalUnit($user, $responsibleUnit))->toBeTrue()
        ->and($scope->canWriteOrganizationalUnit($user, $responsibleUnit))->toBeFalse()
        ->and($scope->canReadOrganizationalUnit($user, $otherUnit))->toBeFalse();
});

test('direct organizational unit assignments provide scoped write access', function () {
    $user = User::factory()->create();
    $assignedUnit = OrganizationalUnit::factory()->create(['name' => 'Assigned Unit']);
    $unassignedUnit = OrganizationalUnit::factory()->create(['name' => 'Unassigned Unit']);

    UserOrganizationalUnitAssignment::factory()
        ->forUser($user)
        ->forOrganizationalUnit($assignedUnit)
        ->create();

    $scope = app(AssignmentAccessScope::class);

    expect($scope->readableOrganizationalUnits($user)->pluck('id')->all())->toBe([$assignedUnit->getKey()])
        ->and($scope->writableOrganizationalUnits($user)->pluck('id')->all())->toBe([$assignedUnit->getKey()])
        ->and($scope->canReadOrganizationalUnit($user, $assignedUnit))->toBeTrue()
        ->and($scope->canWriteOrganizationalUnit($user, $assignedUnit))->toBeTrue()
        ->and($scope->canReadOrganizationalUnit($user, $unassignedUnit))->toBeFalse()
        ->and($scope->canWriteOrganizationalUnit($user, $unassignedUnit))->toBeFalse();
});

test('site update permission still requires writable customer scope', function () {
    $siteOnlyUser = grantPermissions(
        User::factory()->create(),
        GuardGuideAccessCatalog::SITES_UPDATE,
    );
    $scopedSiteUser = grantPermissions(
        User::factory()->create(),
        GuardGuideAccessCatalog::SITES_UPDATE,
    );
    $customer = Customer::factory()->create();
    $site = Site::factory()
        ->forCustomer($customer)
        ->create();

    UserCustomerAssignment::factory()
        ->forUser($scopedSiteUser)
        ->forCustomer($customer)
        ->create();

    $scope = app(AssignmentAccessScope::class);

    expect($scope->writableSites($siteOnlyUser)->pluck('id')->all())->toBe([])
        ->and($scope->canWriteSite($siteOnlyUser, $site))->toBeFalse()
        ->and($scope->writableSites($scopedSiteUser)->pluck('id')->all())->toBe([$site->getKey()])
        ->and($scope->canWriteSite($scopedSiteUser, $site))->toBeTrue();
});

test('customer creation organizational unit scope resolves company descendants from assigned subtrees', function () {
    $user = User::factory()->create();
    $root = OrganizationalUnit::factory()->create([
        'type' => OrganizationalUnitType::Division,
        'name' => 'Operations',
    ]);
    $companyA = OrganizationalUnit::factory()->company()->childOf($root)->create([
        'name' => 'Alpha GmbH',
        'sort_order' => 10,
    ]);
    $team = OrganizationalUnit::factory()->childOf($root)->create([
        'type' => OrganizationalUnitType::Team,
        'name' => 'Field Team',
        'sort_order' => 20,
    ]);
    $companyB = OrganizationalUnit::factory()->company()->childOf($team)->create([
        'name' => 'Beta GmbH',
        'sort_order' => 30,
    ]);
    $outsideCompany = OrganizationalUnit::factory()->company()->create([
        'name' => 'Gamma GmbH',
        'sort_order' => 40,
    ]);

    UserOrganizationalUnitAssignment::factory()
        ->forUser($user)
        ->forOrganizationalUnit($root)
        ->create();

    $scope = app(AssignmentAccessScope::class);

    expect($scope->writableCustomerOrganizationalUnits($user)->pluck('id')->all())
        ->toBe([$companyA->getKey(), $companyB->getKey()])
        ->and($scope->writableCustomerOrganizationalUnits($user)->pluck('name')->all())
        ->toBe(['Alpha GmbH', 'Beta GmbH'])
        ->and($scope->writableCustomerOrganizationalUnits($user)->contains('id', $outsideCompany->getKey()))
        ->toBeFalse();
});

test('organizational unit update permission allows choosing all company units for customer creation', function () {
    $user = grantPermissions(
        User::factory()->create(),
        GuardGuideAccessCatalog::ORGANIZATIONAL_UNITS_UPDATE,
    );
    $company = OrganizationalUnit::factory()->company()->create([
        'name' => 'Alpha GmbH',
        'sort_order' => 10,
    ]);
    OrganizationalUnit::factory()->create([
        'type' => OrganizationalUnitType::Department,
        'name' => 'Internal Ops',
    ]);
    $otherCompany = OrganizationalUnit::factory()->company()->create([
        'name' => 'Beta GmbH',
        'sort_order' => 20,
    ]);

    $scope = app(AssignmentAccessScope::class);

    expect($scope->writableCustomerOrganizationalUnits($user)->pluck('id')->all())
        ->toBe([$company->getKey(), $otherCompany->getKey()]);
});

test('global permissions keep unrestricted read and write scopes separate from assignments', function () {
    $readUser = grantPermissions(
        User::factory()->create(),
        GuardGuideAccessCatalog::CUSTOMERS_VIEW,
        GuardGuideAccessCatalog::SITES_VIEW,
        GuardGuideAccessCatalog::ORGANIZATIONAL_UNITS_VIEW,
    );
    $writeUser = grantPermissions(
        User::factory()->create(),
        GuardGuideAccessCatalog::CUSTOMERS_UPDATE,
        GuardGuideAccessCatalog::SITES_UPDATE,
        GuardGuideAccessCatalog::ORGANIZATIONAL_UNITS_UPDATE,
    );
    $unit = OrganizationalUnit::factory()->create();
    $customer = Customer::factory()->create();
    $site = Site::factory()
        ->forCustomer($customer)
        ->managedBy($unit)
        ->create();

    $scope = app(AssignmentAccessScope::class);

    expect($scope->canReadOrganizationalUnit($readUser, $unit))->toBeTrue()
        ->and($scope->canReadCustomer($readUser, $customer))->toBeTrue()
        ->and($scope->canReadSite($readUser, $site))->toBeTrue()
        ->and($scope->canWriteOrganizationalUnit($readUser, $unit))->toBeFalse()
        ->and($scope->canWriteCustomer($readUser, $customer))->toBeFalse()
        ->and($scope->canWriteSite($readUser, $site))->toBeFalse()
        ->and($scope->canReadOrganizationalUnit($writeUser, $unit))->toBeFalse()
        ->and($scope->canReadCustomer($writeUser, $customer))->toBeFalse()
        ->and($scope->canReadSite($writeUser, $site))->toBeFalse()
        ->and($scope->canWriteOrganizationalUnit($writeUser, $unit))->toBeTrue()
        ->and($scope->canWriteCustomer($writeUser, $customer))->toBeTrue()
        ->and($scope->canWriteSite($writeUser, $site))->toBeTrue();
});

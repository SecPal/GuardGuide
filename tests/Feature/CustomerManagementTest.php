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
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;

function customerManager(array $attributes = []): User
{
    return grantPermissions(
        User::factory()->create($attributes),
        GuardGuideAccessCatalog::CUSTOMERS_VIEW,
        GuardGuideAccessCatalog::CUSTOMERS_CREATE,
        GuardGuideAccessCatalog::CUSTOMERS_UPDATE,
    );
}

test('guests are redirected from the customer management page', function () {
    $this->get(route('customers.index'))
        ->assertRedirect(route('login'));
});

test('unverified users are redirected from the customer management page', function () {
    $this->skipUnlessFortifyHas(Features::emailVerification());

    $user = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->get(route('customers.index'))
        ->assertRedirect(route('verification.notice'));
});

test('users without customer access cannot view or modify customers', function () {
    $user = User::factory()->create();
    $customer = Customer::factory()->create(['name' => 'Existing Customer']);

    $this->actingAs($user)
        ->get(route('customers.index'))
        ->assertForbidden();

    $this->actingAs($user)
        ->post(route('customers.store'), [
            'name' => 'Should Not Persist',
        ])
        ->assertForbidden();

    $this->actingAs($user)
        ->put(route('customers.update', $customer), [
            'name' => 'Should Not Update',
        ])
        ->assertForbidden();

    $this->assertDatabaseMissing('customers', ['name' => 'Should Not Persist']);
    $this->assertDatabaseMissing('customers', ['name' => 'Should Not Update']);
});

test('customers can be viewed and created by customer managers', function () {
    $existingCompany = OrganizationalUnit::factory()->company()->create([
        'name' => 'SecPal West',
    ]);
    $newCompany = OrganizationalUnit::factory()->company()->create([
        'name' => 'SecPal East',
    ]);
    Customer::factory()->create([
        'organizational_unit_id' => $existingCompany->getKey(),
        'name' => 'Alpha GmbH',
    ]);
    $user = customerManager();
    grantPermissions($user, GuardGuideAccessCatalog::ORGANIZATIONAL_UNITS_UPDATE);

    $this->actingAs($user)
        ->get(route('customers.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customers/index')
            ->has('customers', 1)
            ->where('customers.0.name', 'Alpha GmbH')
            ->where('customers.0.organizational_unit_name', 'SecPal West')
            ->where('customers.0.can_update', true)
            ->where('canCreateCustomers', true)
            ->has('customerOrganizationOptions', 2)
            ->where('mustChooseOrganization', true)
            ->where('organizationSelectionLocked', false),
        );

    $this->actingAs($user)
        ->post(route('customers.store'), [
            'organizational_unit_id' => $newCompany->getKey(),
            'name' => 'Beta AG',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('customers.index'));

    $this->assertDatabaseHas('customers', [
        'organizational_unit_id' => $newCompany->getKey(),
        'name' => 'Beta AG',
    ]);
});

test('customer view permission does not allow creating customers', function () {
    $user = grantPermissions(
        User::factory()->create(),
        GuardGuideAccessCatalog::CUSTOMERS_VIEW,
    );

    $this->actingAs($user)
        ->post(route('customers.store'), [
            'name' => 'View Only Customer',
        ])
        ->assertForbidden();

    $this->assertDatabaseMissing('customers', [
        'name' => 'View Only Customer',
    ]);
});

test('customers can be edited when the user has write scope', function () {
    $customer = Customer::factory()->create(['name' => 'Old Name']);
    $user = customerManager();

    $this->actingAs($user)
        ->put(route('customers.update', $customer), [
            'name' => 'New Name',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('customers.index'));

    expect($customer->refresh()->name)->toBe('New Name');
});

test('customer names must not be blank through management endpoints', function () {
    $user = customerManager();
    $company = OrganizationalUnit::factory()->company()->create();

    UserOrganizationalUnitAssignment::factory()
        ->forUser($user)
        ->forOrganizationalUnit($company)
        ->create();

    $this->actingAs($user)
        ->from(route('customers.index'))
        ->post(route('customers.store'), [
            'organizational_unit_id' => $company->getKey(),
            'name' => '   ',
        ])
        ->assertSessionHasErrors('name')
        ->assertRedirect(route('customers.index'));

    $this->assertDatabaseMissing('customers', [
        'name' => '   ',
    ]);
});

test('users without global customer rights only see customers in their assignment scope', function () {
    $user = User::factory()->create();
    $assignedCustomer = Customer::factory()->create(['name' => 'Assigned Customer']);
    $siteCustomer = Customer::factory()->create(['name' => 'Site Parent Customer']);
    $unassignedCustomer = Customer::factory()->create(['name' => 'Unassigned Customer']);
    $site = Site::factory()
        ->forCustomer($siteCustomer)
        ->create(['name' => 'Assigned Site']);

    UserCustomerAssignment::factory()
        ->forUser($user)
        ->forCustomer($assignedCustomer)
        ->create();
    UserSiteAssignment::factory()
        ->forUser($user)
        ->forSite($site)
        ->create();

    $this->actingAs($user)
        ->get(route('customers.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customers/index')
            ->has('customers', 2)
            ->where('customers.0.name', 'Assigned Customer')
            ->where('customers.0.can_update', true)
            ->where('customers.1.name', 'Site Parent Customer')
            ->where('customers.1.can_update', false)
            ->where('canCreateCustomers', false),
        );

    $this->actingAs($user)
        ->put(route('customers.update', $assignedCustomer), [
            'name' => 'Scoped Update',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('customers.index'));

    $this->actingAs($user)
        ->put(route('customers.update', $siteCustomer), [
            'name' => 'Derived Scope Update',
        ])
        ->assertForbidden();

    $this->actingAs($user)
        ->put(route('customers.update', $unassignedCustomer), [
            'name' => 'Unassigned Update',
        ])
        ->assertForbidden();

    expect($assignedCustomer->refresh()->name)->toBe('Scoped Update')
        ->and($siteCustomer->refresh()->name)->toBe('Site Parent Customer')
        ->and($unassignedCustomer->refresh()->name)->toBe('Unassigned Customer');
});

test('customer creation is prefilled and locked when the user can write exactly one company', function () {
    $company = OrganizationalUnit::factory()->company()->create([
        'name' => 'SecPal North',
    ]);
    $user = customerManager();

    UserOrganizationalUnitAssignment::factory()
        ->forUser($user)
        ->forOrganizationalUnit($company)
        ->create();

    $this->actingAs($user)
        ->get(route('customers.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('customerOrganizationOptions', [[
                'id' => $company->getKey(),
                'name' => 'SecPal North',
            ]])
            ->where('resolvedOrganizationId', $company->getKey())
            ->where('mustChooseOrganization', false)
            ->where('organizationSelectionLocked', true),
        );

    $this->actingAs($user)
        ->post(route('customers.store'), [
            'name' => 'Locked Customer',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('customers.index'));

    $this->assertDatabaseHas('customers', [
        'name' => 'Locked Customer',
        'organizational_unit_id' => $company->getKey(),
    ]);
});

test('customer creation requires an explicit choice when several companies are writable', function () {
    $root = OrganizationalUnit::factory()->create([
        'type' => OrganizationalUnitType::Division,
        'name' => 'Operations',
    ]);
    OrganizationalUnit::factory()->company()->childOf($root)->create([
        'name' => 'Alpha GmbH',
    ]);
    OrganizationalUnit::factory()->company()->childOf($root)->create([
        'name' => 'Beta GmbH',
    ]);
    $user = customerManager();

    UserOrganizationalUnitAssignment::factory()
        ->forUser($user)
        ->forOrganizationalUnit($root)
        ->create();

    $this->actingAs($user)
        ->from(route('customers.index'))
        ->post(route('customers.store'), [
            'name' => 'Needs Choice',
        ])
        ->assertSessionHasErrors('organizational_unit_id')
        ->assertRedirect(route('customers.index'));
});

test('customer creation rejects organizational units outside the writable company scope', function () {
    $allowedCompany = OrganizationalUnit::factory()->company()->create([
        'name' => 'Allowed GmbH',
    ]);
    $forbiddenCompany = OrganizationalUnit::factory()->company()->create([
        'name' => 'Forbidden GmbH',
    ]);
    $user = customerManager();

    UserOrganizationalUnitAssignment::factory()
        ->forUser($user)
        ->forOrganizationalUnit($allowedCompany)
        ->create();

    $this->actingAs($user)
        ->from(route('customers.index'))
        ->post(route('customers.store'), [
            'organizational_unit_id' => $forbiddenCompany->getKey(),
            'name' => 'Out of Scope Customer',
        ])
        ->assertSessionHasErrors('organizational_unit_id')
        ->assertRedirect(route('customers.index'));

    $this->assertDatabaseMissing('customers', [
        'name' => 'Out of Scope Customer',
    ]);
});

test('customer organization assignment remains unchanged on update', function () {
    $originalCompany = OrganizationalUnit::factory()->company()->create([
        'name' => 'Original GmbH',
    ]);
    $otherCompany = OrganizationalUnit::factory()->company()->create([
        'name' => 'Other GmbH',
    ]);
    $customer = Customer::factory()->create([
        'organizational_unit_id' => $originalCompany->getKey(),
        'name' => 'Immutable Customer',
    ]);
    $user = customerManager();

    $this->actingAs($user)
        ->put(route('customers.update', $customer), [
            'organizational_unit_id' => $otherCompany->getKey(),
            'name' => 'Renamed Customer',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('customers.index'));

    expect($customer->refresh()->name)->toBe('Renamed Customer')
        ->and($customer->organizational_unit_id)->toBe($originalCompany->getKey());
});

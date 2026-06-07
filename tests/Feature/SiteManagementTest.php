<?php

use App\Auth\GuardGuideAccessCatalog;
use App\Models\Customer;
use App\Models\OrganizationalUnit;
use App\Models\Site;
use App\Models\User;
use App\Models\UserCustomerAssignment;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;

function siteManager(array $attributes = []): User
{
    return grantPermissions(
        User::factory()->create($attributes),
        GuardGuideAccessCatalog::SITES_VIEW,
        GuardGuideAccessCatalog::SITES_CREATE,
        GuardGuideAccessCatalog::SITES_UPDATE,
    );
}

test('guests are redirected from the site management page', function () {
    $this->get(route('sites.index'))
        ->assertRedirect(route('login'));
});

test('unverified users are redirected from the site management page', function () {
    $this->skipUnlessFortifyHas(Features::emailVerification());

    $user = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->get(route('sites.index'))
        ->assertRedirect(route('verification.notice'));
});

test('users without site permissions cannot view create or update sites', function () {
    $user = User::factory()->create();
    $customer = Customer::factory()->create();
    $site = Site::factory()
        ->forCustomer($customer)
        ->create(['name' => 'Existing Site']);

    $this->actingAs($user)
        ->get(route('sites.index'))
        ->assertForbidden();

    $this->actingAs($user)
        ->post(route('sites.store'), [
            'name' => 'Should Not Persist',
            'customer_id' => $customer->getKey(),
        ])
        ->assertForbidden();

    $this->actingAs($user)
        ->put(route('sites.update', $site), [
            'name' => 'Should Not Update',
            'customer_id' => $customer->getKey(),
        ])
        ->assertForbidden();

    $this->assertDatabaseMissing('sites', ['name' => 'Should Not Persist']);
    $this->assertDatabaseMissing('sites', ['name' => 'Should Not Update']);
});

test('sites can be viewed created and edited within the users customer scope', function () {
    $user = siteManager();
    $customer = Customer::factory()->create(['name' => 'Assigned Customer']);
    $organizationalUnit = OrganizationalUnit::factory()->create(['name' => 'Operations']);
    $site = Site::factory()
        ->forCustomer($customer)
        ->create(['name' => 'Old Site']);

    UserCustomerAssignment::factory()
        ->forUser($user)
        ->forCustomer($customer)
        ->create();

    $this->actingAs($user)
        ->get(route('sites.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('sites/index')
            ->has('sites', 1)
            ->where('sites.0.name', 'Old Site')
            ->where('sites.0.customer_name', 'Assigned Customer')
            ->where('sites.0.can_update', true)
            ->has('customers', 1)
            ->where('customers.0.name', 'Assigned Customer')
            ->where('canCreateSites', true),
        );

    $this->actingAs($user)
        ->post(route('sites.store'), [
            'name' => 'New Site',
            'customer_id' => $customer->getKey(),
            'organizational_unit_id' => $organizationalUnit->getKey(),
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('sites.index'));

    $this->assertDatabaseHas('sites', [
        'name' => 'New Site',
        'customer_id' => $customer->getKey(),
        'organizational_unit_id' => $organizationalUnit->getKey(),
    ]);

    $this->actingAs($user)
        ->put(route('sites.update', $site), [
            'name' => 'Updated Site',
            'customer_id' => $customer->getKey(),
            'organizational_unit_id' => null,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('sites.index'));

    expect($site->refresh()->name)->toBe('Updated Site')
        ->and($site->organizational_unit_id)->toBeNull();
});

test('site create permission does not allow creating outside the users customer scope', function () {
    $user = siteManager();
    $customer = Customer::factory()->create(['name' => 'Unassigned Customer']);

    $this->actingAs($user)
        ->from(route('sites.index'))
        ->post(route('sites.store'), [
            'name' => 'Out Of Scope Site',
            'customer_id' => $customer->getKey(),
        ])
        ->assertSessionHasErrors('customer_id')
        ->assertRedirect(route('sites.index'));

    $this->assertDatabaseMissing('sites', [
        'name' => 'Out Of Scope Site',
    ]);
});

test('site update permission does not allow assigning an out of scope customer', function () {
    $user = siteManager();
    $assignedCustomer = Customer::factory()->create(['name' => 'Assigned Customer']);
    $unassignedCustomer = Customer::factory()->create(['name' => 'Unassigned Customer']);
    $site = Site::factory()
        ->forCustomer($assignedCustomer)
        ->create(['name' => 'Scoped Site']);

    UserCustomerAssignment::factory()
        ->forUser($user)
        ->forCustomer($assignedCustomer)
        ->create();

    $this->actingAs($user)
        ->from(route('sites.index'))
        ->put(route('sites.update', $site), [
            'name' => 'Moved Site',
            'customer_id' => $unassignedCustomer->getKey(),
        ])
        ->assertSessionHasErrors('customer_id')
        ->assertRedirect(route('sites.index'));

    expect($site->refresh()->customer_id)->toBe($assignedCustomer->getKey())
        ->and($site->name)->toBe('Scoped Site');
});

test('global customer update permission allows site management across customer scopes', function () {
    $user = grantPermissions(
        User::factory()->create(),
        GuardGuideAccessCatalog::SITES_VIEW,
        GuardGuideAccessCatalog::SITES_CREATE,
        GuardGuideAccessCatalog::SITES_UPDATE,
        GuardGuideAccessCatalog::CUSTOMERS_UPDATE,
    );
    $customer = Customer::factory()->create(['name' => 'Global Customer']);

    $this->actingAs($user)
        ->post(route('sites.store'), [
            'name' => 'Global Site',
            'customer_id' => $customer->getKey(),
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('sites.index'));

    $this->assertDatabaseHas('sites', [
        'name' => 'Global Site',
        'customer_id' => $customer->getKey(),
    ]);
});

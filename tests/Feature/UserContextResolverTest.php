<?php

use App\Models\Customer;
use App\Models\OrganizationalUnit;
use App\Models\Site;
use App\Models\User;
use App\Models\UserCustomerAssignment;
use App\Models\UserOrganizationalUnitAssignment;
use App\Models\UserSiteAssignment;
use App\Services\UserContextResolver;
use Inertia\Testing\AssertableInertia as Assert;

test('resolver returns empty context for users without assignments', function () {
    $user = User::factory()->create();

    $context = app(UserContextResolver::class)->resolve($user);

    expect($context['organizationalUnits'])->toBe([])
        ->and($context['customers'])->toBe([])
        ->and($context['sites'])->toBe([]);
});

test('resolver returns only assigned mixed organizational and customer contexts', function () {
    $user = User::factory()->create();
    $assignedUnit = OrganizationalUnit::factory()->create(['name' => 'Assigned Unit']);
    $unassignedUnit = OrganizationalUnit::factory()->create(['name' => 'Unassigned Unit']);
    $assignedCustomer = Customer::factory()->create(['name' => 'Assigned Customer']);
    $unassignedCustomer = Customer::factory()->create(['name' => 'Unassigned Customer']);

    UserOrganizationalUnitAssignment::factory()
        ->forUser($user)
        ->forOrganizationalUnit($assignedUnit)
        ->create();
    UserCustomerAssignment::factory()
        ->forUser($user)
        ->forCustomer($assignedCustomer)
        ->create();

    $context = app(UserContextResolver::class)->resolve($user);

    expect($context['organizationalUnits'])->toHaveCount(1)
        ->and($context['organizationalUnits'][0])->toMatchArray([
            'id' => $assignedUnit->getKey(),
            'name' => 'Assigned Unit',
            'sources' => ['assigned'],
        ])
        ->and($context['organizationalUnits'][0]['id'])->not->toBe($unassignedUnit->getKey())
        ->and($context['customers'])->toHaveCount(1)
        ->and($context['customers'][0])->toMatchArray([
            'id' => $assignedCustomer->getKey(),
            'name' => 'Assigned Customer',
            'sources' => ['assigned'],
        ])
        ->and($context['customers'][0]['id'])->not->toBe($unassignedCustomer->getKey())
        ->and($context['sites'])->toBe([]);
});

test('resolver includes object assignments and derives parent customer and responsible unit', function () {
    $user = User::factory()->create();
    $customer = Customer::factory()->create(['name' => 'Object Customer']);
    $unit = OrganizationalUnit::factory()->create(['name' => 'Object Unit']);
    $site = Site::factory()
        ->forCustomer($customer)
        ->managedBy($unit)
        ->create(['name' => 'Werk Nord']);
    $unassignedSite = Site::factory()->create(['name' => 'Werk Sued']);

    UserSiteAssignment::factory()
        ->forUser($user)
        ->forSite($site)
        ->create();

    $context = app(UserContextResolver::class)->resolve($user);

    expect($context['sites'])->toHaveCount(1)
        ->and($context['sites'][0])->toMatchArray([
            'id' => $site->getKey(),
            'customer_id' => $customer->getKey(),
            'customer_name' => 'Object Customer',
            'organizational_unit_id' => $unit->getKey(),
            'organizational_unit_name' => 'Object Unit',
            'name' => 'Werk Nord',
            'sources' => ['assigned'],
        ])
        ->and($context['sites'][0]['id'])->not->toBe($unassignedSite->getKey())
        ->and($context['customers'])->toHaveCount(1)
        ->and($context['customers'][0])->toMatchArray([
            'id' => $customer->getKey(),
            'name' => 'Object Customer',
            'sources' => ['site'],
        ])
        ->and($context['organizationalUnits'])->toHaveCount(1)
        ->and($context['organizationalUnits'][0])->toMatchArray([
            'id' => $unit->getKey(),
            'name' => 'Object Unit',
            'sources' => ['site'],
        ]);
});

test('resolver does not expose soft-deleted site organizational units in context', function () {
    $user = User::factory()->create();
    $customer = Customer::factory()->create(['name' => 'Object Customer']);
    $unit = OrganizationalUnit::factory()->create(['name' => 'Deleted Unit']);
    $site = Site::factory()
        ->forCustomer($customer)
        ->managedBy($unit)
        ->create(['name' => 'Werk Nord']);

    UserSiteAssignment::factory()
        ->forUser($user)
        ->forSite($site)
        ->create();

    $unit->delete();

    $context = app(UserContextResolver::class)->resolve($user);

    expect($context['sites'])->toHaveCount(1)
        ->and($context['sites'][0])->toMatchArray([
            'id' => $site->getKey(),
            'customer_id' => $customer->getKey(),
            'customer_name' => 'Object Customer',
            'organizational_unit_id' => null,
            'organizational_unit_name' => null,
            'name' => 'Werk Nord',
            'sources' => ['assigned'],
        ])
        ->and($context['customers'])->toHaveCount(1)
        ->and($context['customers'][0])->toMatchArray([
            'id' => $customer->getKey(),
            'name' => 'Object Customer',
            'sources' => ['site'],
        ])
        ->and($context['organizationalUnits'])->toBe([]);
});

test('authenticated inertia responses share the effective user context', function () {
    $user = User::factory()->create();
    $customer = Customer::factory()->create(['name' => 'Shared Customer']);

    UserCustomerAssignment::factory()
        ->forUser($user)
        ->forCustomer($customer)
        ->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('effectiveContext.customers.0.id', $customer->getKey())
            ->where('effectiveContext.customers.0.name', 'Shared Customer')
            ->where('effectiveContext.customers.0.sources', ['assigned'])
            ->where('effectiveContext.organizationalUnits', [])
            ->where('effectiveContext.sites', []),
        );
});

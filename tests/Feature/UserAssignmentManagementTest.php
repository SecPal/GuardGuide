<?php

use App\Auth\GuardGuideAccessCatalog;
use App\Models\Customer;
use App\Models\OrganizationalUnit;
use App\Models\Site;
use App\Models\User;
use App\Models\UserCustomerAssignment;
use App\Models\UserOrganizationalUnitAssignment;
use App\Models\UserSiteAssignment;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;

function userAssignmentManager(array $attributes = []): User
{
    return grantPermissions(
        User::factory()->create($attributes),
        GuardGuideAccessCatalog::USER_ASSIGNMENTS_VIEW,
        GuardGuideAccessCatalog::USER_ASSIGNMENTS_MANAGE,
    );
}

test('guests are redirected from the user assignment page', function () {
    $user = User::factory()->create();

    $this->get(route('user-assignments.index', $user))
        ->assertRedirect(route('login'));
});

test('unverified users are redirected from the user assignment page', function () {
    $this->skipUnlessFortifyHas(Features::emailVerification());

    $user = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->get(route('user-assignments.index', $user))
        ->assertRedirect(route('verification.notice'));
});

test('users without user assignment permissions cannot view or manage assignments', function () {
    $actingUser = User::factory()->create();
    $selectedUser = User::factory()->create();
    $customer = Customer::factory()->create();
    $unit = OrganizationalUnit::factory()->create();
    $site = Site::factory()->forCustomer($customer)->create();

    $this->actingAs($actingUser)
        ->get(route('user-assignments.index', $selectedUser))
        ->assertForbidden();

    $this->actingAs($actingUser)
        ->get(route('user-assignments.redirect'))
        ->assertForbidden();

    $this->actingAs($actingUser)
        ->post(route('user-assignments.customers.store', $selectedUser), [
            'customer_id' => $customer->getKey(),
        ])
        ->assertForbidden();

    $this->actingAs($actingUser)
        ->post(route('user-assignments.organizational-units.store', $selectedUser), [
            'organizational_unit_id' => $unit->getKey(),
        ])
        ->assertForbidden();

    $this->actingAs($actingUser)
        ->post(route('user-assignments.sites.store', $selectedUser), [
            'site_id' => $site->getKey(),
        ])
        ->assertForbidden();
});

test('assignment view permission does not allow managing a selected user', function () {
    $actingUser = grantPermissions(
        User::factory()->create(['name' => 'Viewer']),
        GuardGuideAccessCatalog::USER_ASSIGNMENTS_VIEW,
    );
    $selectedUser = User::factory()->create(['name' => 'Target']);

    $this->actingAs($actingUser)
        ->get(route('user-assignments.redirect'))
        ->assertRedirect(route('user-assignments.index', $selectedUser));

    $this->actingAs($actingUser)
        ->get(route('user-assignments.index', $selectedUser))
        ->assertForbidden();
});

test('users with assignment management permission can view assignments for a user', function () {
    $selectedUser = User::factory()->create([
        'name' => 'Mira Admin',
        'email' => 'mira@example.test',
    ]);
    $actingUser = userAssignmentManager();
    $unit = OrganizationalUnit::factory()->create(['name' => 'Einsatzleitung']);
    $customer = Customer::factory()->create(['name' => 'Acme Security']);
    $site = Site::factory()->forCustomer($customer)->create(['name' => 'Werk Nord']);

    UserOrganizationalUnitAssignment::factory()
        ->forUser($selectedUser)
        ->forOrganizationalUnit($unit)
        ->create();
    UserCustomerAssignment::factory()
        ->forUser($selectedUser)
        ->forCustomer($customer)
        ->create();
    UserSiteAssignment::factory()
        ->forUser($selectedUser)
        ->forSite($site)
        ->create();

    $this->actingAs($actingUser)
        ->get(route('user-assignments.index', $selectedUser))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('user-assignments/index')
            ->where('selectedUser.id', $selectedUser->getKey())
            ->where('selectedUser.name', 'Mira Admin')
            ->has('users', 2)
            ->where('assignments.organizationalUnits.0.id', $unit->getKey())
            ->where('assignments.customers.0.id', $customer->getKey())
            ->where('assignments.sites.0.id', $site->getKey())
            ->where('assignments.sites.0.customer_id', $customer->getKey())
            ->where('assignments.sites.0.customer_name', 'Acme Security')
            ->has('options.organizationalUnits', 1)
            ->has('options.customers', 1)
            ->has('options.sites', 1),
        );
});

test('assignment landing route redirects to the first user', function () {
    $zUser = userAssignmentManager(['name' => 'Zoe']);
    $aUser = User::factory()->create(['name' => 'Ada']);

    $this->actingAs($zUser)
        ->get(route('user-assignments.redirect'))
        ->assertRedirect(route('user-assignments.index', $aUser));
});

test('organizational unit assignments can be added and removed through the UI endpoint', function () {
    $actingUser = userAssignmentManager();
    $selectedUser = User::factory()->create();
    $unit = OrganizationalUnit::factory()->create();

    $this->actingAs($actingUser)
        ->post(route('user-assignments.organizational-units.store', $selectedUser), [
            'organizational_unit_id' => $unit->getKey(),
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('user-assignments.index', $selectedUser));

    $this->assertDatabaseHas('user_organizational_unit_assignments', [
        'user_id' => $selectedUser->getKey(),
        'organizational_unit_id' => $unit->getKey(),
    ]);

    $this->actingAs($actingUser)
        ->delete(route('user-assignments.organizational-units.destroy', [$selectedUser, $unit]))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('user-assignments.index', $selectedUser));

    $this->assertDatabaseMissing('user_organizational_unit_assignments', [
        'user_id' => $selectedUser->getKey(),
        'organizational_unit_id' => $unit->getKey(),
    ]);
});

test('customer assignments can be added and removed through the UI endpoint', function () {
    $actingUser = userAssignmentManager();
    $selectedUser = User::factory()->create();
    $customer = Customer::factory()->create();

    $this->actingAs($actingUser)
        ->post(route('user-assignments.customers.store', $selectedUser), [
            'customer_id' => $customer->getKey(),
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('user-assignments.index', $selectedUser));

    $this->assertDatabaseHas('user_customer_assignments', [
        'user_id' => $selectedUser->getKey(),
        'customer_id' => $customer->getKey(),
    ]);

    $this->actingAs($actingUser)
        ->delete(route('user-assignments.customers.destroy', [$selectedUser, $customer]))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('user-assignments.index', $selectedUser));

    $this->assertDatabaseMissing('user_customer_assignments', [
        'user_id' => $selectedUser->getKey(),
        'customer_id' => $customer->getKey(),
    ]);
});

test('removing a customer assignment also removes its site assignments', function () {
    $actingUser = userAssignmentManager();
    $selectedUser = User::factory()->create();
    $customer = Customer::factory()->create();
    $site = Site::factory()->forCustomer($customer)->create();

    UserCustomerAssignment::factory()
        ->forUser($selectedUser)
        ->forCustomer($customer)
        ->create();
    UserSiteAssignment::factory()
        ->forUser($selectedUser)
        ->forSite($site)
        ->create();

    $this->actingAs($actingUser)
        ->delete(route('user-assignments.customers.destroy', [$selectedUser, $customer]))
        ->assertSessionHasNoErrors();

    $this->assertDatabaseMissing('user_customer_assignments', [
        'user_id' => $selectedUser->getKey(),
        'customer_id' => $customer->getKey(),
    ]);
    $this->assertDatabaseMissing('user_site_assignments', [
        'user_id' => $selectedUser->getKey(),
        'site_id' => $site->getKey(),
    ]);
});

test('removing a customer assignment also removes its trashed site assignments', function () {
    $actingUser = userAssignmentManager();
    $selectedUser = User::factory()->create();
    $customer = Customer::factory()->create();
    $site = Site::factory()->forCustomer($customer)->create();

    UserCustomerAssignment::factory()
        ->forUser($selectedUser)
        ->forCustomer($customer)
        ->create();
    UserSiteAssignment::factory()
        ->forUser($selectedUser)
        ->forSite($site)
        ->create();

    $site->delete();

    $this->actingAs($actingUser)
        ->delete(route('user-assignments.customers.destroy', [$selectedUser, $customer]))
        ->assertSessionHasNoErrors();

    $this->assertDatabaseMissing('user_customer_assignments', [
        'user_id' => $selectedUser->getKey(),
        'customer_id' => $customer->getKey(),
    ]);
    $this->assertDatabaseMissing('user_site_assignments', [
        'user_id' => $selectedUser->getKey(),
        'site_id' => $site->getKey(),
    ]);
});

test('site assignments require an existing customer assignment', function () {
    $actingUser = userAssignmentManager();
    $selectedUser = User::factory()->create();
    $customer = Customer::factory()->create();
    $site = Site::factory()->forCustomer($customer)->create();

    $this->actingAs($actingUser)
        ->from(route('user-assignments.index', $selectedUser))
        ->post(route('user-assignments.sites.store', $selectedUser), [
            'site_id' => $site->getKey(),
        ])
        ->assertSessionHasErrors('site_id')
        ->assertRedirect(route('user-assignments.index', $selectedUser));

    $this->assertDatabaseMissing('user_site_assignments', [
        'user_id' => $selectedUser->getKey(),
        'site_id' => $site->getKey(),
    ]);
});

test('site assignments can be added and removed after customer assignment exists', function () {
    $actingUser = userAssignmentManager();
    $selectedUser = User::factory()->create();
    $customer = Customer::factory()->create();
    $site = Site::factory()->forCustomer($customer)->create();

    UserCustomerAssignment::factory()
        ->forUser($selectedUser)
        ->forCustomer($customer)
        ->create();

    $this->actingAs($actingUser)
        ->post(route('user-assignments.sites.store', $selectedUser), [
            'site_id' => $site->getKey(),
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('user-assignments.index', $selectedUser));

    $this->assertDatabaseHas('user_site_assignments', [
        'user_id' => $selectedUser->getKey(),
        'site_id' => $site->getKey(),
    ]);

    $this->actingAs($actingUser)
        ->delete(route('user-assignments.sites.destroy', [$selectedUser, $site]))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('user-assignments.index', $selectedUser));

    $this->assertDatabaseMissing('user_site_assignments', [
        'user_id' => $selectedUser->getKey(),
        'site_id' => $site->getKey(),
    ]);
});

test('duplicate assignment submissions are shown as validation errors', function () {
    $actingUser = userAssignmentManager();
    $selectedUser = User::factory()->create();
    $customer = Customer::factory()->create();

    UserCustomerAssignment::factory()
        ->forUser($selectedUser)
        ->forCustomer($customer)
        ->create();

    $this->actingAs($actingUser)
        ->from(route('user-assignments.index', $selectedUser))
        ->post(route('user-assignments.customers.store', $selectedUser), [
            'customer_id' => $customer->getKey(),
        ])
        ->assertSessionHasErrors('customer_id')
        ->assertRedirect(route('user-assignments.index', $selectedUser));
});

test('storing a site assignment is rejected when the customer assignment was removed concurrently', function () {
    $actingUser = userAssignmentManager();
    $selectedUser = User::factory()->create();
    $customer = Customer::factory()->create();
    $site = Site::factory()->forCustomer($customer)->create();

    $customerAssignment = UserCustomerAssignment::factory()
        ->forUser($selectedUser)
        ->forCustomer($customer)
        ->create();

    // Simulate concurrent removal of the customer assignment between the
    // client loading the form (customer shown as assigned) and submitting.
    $customerAssignment->delete();

    $this->actingAs($actingUser)
        ->from(route('user-assignments.index', $selectedUser))
        ->post(route('user-assignments.sites.store', $selectedUser), [
            'site_id' => $site->getKey(),
        ])
        ->assertSessionHasErrors('site_id')
        ->assertRedirect(route('user-assignments.index', $selectedUser));

    $this->assertDatabaseMissing('user_site_assignments', [
        'user_id' => $selectedUser->getKey(),
        'site_id' => $site->getKey(),
    ]);
});

test('assigned site carries its customer name in the index payload', function () {
    $actingUser = userAssignmentManager();
    $selectedUser = User::factory()->create();
    $customer = Customer::factory()->create(['name' => 'Regression Customer']);
    $site = Site::factory()->forCustomer($customer)->create(['name' => 'Regression Site']);

    UserCustomerAssignment::factory()->forUser($selectedUser)->forCustomer($customer)->create();
    UserSiteAssignment::factory()->forUser($selectedUser)->forSite($site)->create();

    $this->actingAs($actingUser)
        ->get(route('user-assignments.index', $selectedUser))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('assignments.sites.0.customer_name', 'Regression Customer'),
        );
});

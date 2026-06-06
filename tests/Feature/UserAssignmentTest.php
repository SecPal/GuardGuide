<?php

use App\Models\Customer;
use App\Models\OrganizationalUnit;
use App\Models\Site;
use App\Models\User;
use App\Models\UserCustomerAssignment;
use App\Models\UserOrganizationalUnitAssignment;
use App\Models\UserSiteAssignment;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

test('users can be assigned to multiple internal organizational units', function () {
    $user = User::factory()->create();
    $firstUnit = OrganizationalUnit::factory()->create([
        'name' => 'Einsatzleitung Nord',
    ]);
    $secondUnit = OrganizationalUnit::factory()->create([
        'name' => 'Disposition West',
    ]);

    UserOrganizationalUnitAssignment::factory()
        ->forUser($user)
        ->forOrganizationalUnit($firstUnit)
        ->create();
    UserOrganizationalUnitAssignment::factory()
        ->forUser($user)
        ->forOrganizationalUnit($secondUnit)
        ->create();

    expect($user->refresh()->organizationalUnits->pluck('id')->all())->toContain(
        $firstUnit->getKey(),
        $secondUnit->getKey(),
    )->and($firstUnit->refresh()->users->pluck('id')->all())->toBe([$user->getKey()]);
});

test('users can be assigned to multiple customers', function () {
    $user = User::factory()->create();
    $firstCustomer = Customer::factory()->create([
        'name' => 'Acme Security GmbH',
    ]);
    $secondCustomer = Customer::factory()->create([
        'name' => 'Globex AG',
    ]);

    UserCustomerAssignment::factory()
        ->forUser($user)
        ->forCustomer($firstCustomer)
        ->create();
    UserCustomerAssignment::factory()
        ->forUser($user)
        ->forCustomer($secondCustomer)
        ->create();

    expect($user->refresh()->customers->pluck('id')->all())->toContain(
        $firstCustomer->getKey(),
        $secondCustomer->getKey(),
    )->and($firstCustomer->refresh()->users->pluck('id')->all())->toBe([$user->getKey()]);
});

test('soft-deleting a customer clears its user assignment pivots', function () {
    $user = User::factory()->create();
    $customer = Customer::factory()->create();
    $site = Site::factory()->create([
        'customer_id' => $customer->getKey(),
    ]);

    UserCustomerAssignment::factory()
        ->forUser($user)
        ->forCustomer($customer)
        ->create();
    UserSiteAssignment::factory()
        ->forUser($user)
        ->forSite($site)
        ->create();

    $customer->delete();

    $this->assertDatabaseMissing('user_customer_assignments', [
        'user_id' => $user->getKey(),
        'customer_id' => $customer->getKey(),
    ]);
    $this->assertDatabaseMissing('user_site_assignments', [
        'user_id' => $user->getKey(),
        'site_id' => $site->getKey(),
    ]);

    $customer->restore();

    $this->actingAs($user)
        ->post(route('user-assignments.customers.store', $user), [
            'customer_id' => $customer->getKey(),
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('user-assignments.index', $user));

    $this->assertDatabaseHas('user_customer_assignments', [
        'user_id' => $user->getKey(),
        'customer_id' => $customer->getKey(),
    ]);
});

test('users can be assigned to multiple individual sites', function () {
    $user = User::factory()->create();
    $firstSite = Site::factory()->create([
        'name' => 'Werk Nord',
    ]);
    $secondSite = Site::factory()->create([
        'name' => 'Campus West',
    ]);

    UserSiteAssignment::factory()
        ->forUser($user)
        ->forSite($firstSite)
        ->create();
    UserSiteAssignment::factory()
        ->forUser($user)
        ->forSite($secondSite)
        ->create();

    expect($user->refresh()->sites->pluck('id')->all())->toContain(
        $firstSite->getKey(),
        $secondSite->getKey(),
    )->and($firstSite->refresh()->users->pluck('id')->all())->toBe([$user->getKey()]);
});

test('user assignments can be removed independently', function () {
    $user = User::factory()->create();
    $unitAssignment = UserOrganizationalUnitAssignment::factory()->forUser($user)->create();
    $customerAssignment = UserCustomerAssignment::factory()->forUser($user)->create();
    $siteAssignment = UserSiteAssignment::factory()->forUser($user)->create();

    $unitAssignment->delete();
    $customerAssignment->delete();
    $siteAssignment->delete();

    $this->assertDatabaseMissing('user_organizational_unit_assignments', [
        'id' => $unitAssignment->getKey(),
    ]);
    $this->assertDatabaseMissing('user_customer_assignments', [
        'id' => $customerAssignment->getKey(),
    ]);
    $this->assertDatabaseMissing('user_site_assignments', [
        'id' => $siteAssignment->getKey(),
    ]);
});

test('duplicate user assignments are rejected', function (string $assignmentClass, string $targetClass, string $targetColumn) {
    $user = User::factory()->create();
    $target = $targetClass::factory()->create();

    $assignmentClass::factory()
        ->forUser($user)
        ->state([$targetColumn => $target->getKey()])
        ->create();

    $assignmentClass::factory()
        ->forUser($user)
        ->state([$targetColumn => $target->getKey()])
        ->create();
})->with([
    [UserOrganizationalUnitAssignment::class, OrganizationalUnit::class, 'organizational_unit_id'],
    [UserCustomerAssignment::class, Customer::class, 'customer_id'],
    [UserSiteAssignment::class, Site::class, 'site_id'],
])->throws(QueryException::class);

test('assignments reject invalid target references', function (string $table, string $targetColumn) {
    $user = User::factory()->create();

    DB::table($table)->insert([
        'id' => (string) Str::uuid(),
        'user_id' => $user->getKey(),
        $targetColumn => (string) Str::uuid(),
        'created_at' => now(),
        'updated_at' => now(),
    ]);
})->with([
    ['user_organizational_unit_assignments', 'organizational_unit_id'],
    ['user_customer_assignments', 'customer_id'],
    ['user_site_assignments', 'site_id'],
])->throws(QueryException::class);

test('assignments reject invalid users', function () {
    $unit = OrganizationalUnit::factory()->create();

    DB::table('user_organizational_unit_assignments')->insert([
        'id' => (string) Str::uuid(),
        'user_id' => 1_000_000,
        'organizational_unit_id' => $unit->getKey(),
        'created_at' => now(),
        'updated_at' => now(),
    ]);
})->throws(QueryException::class);

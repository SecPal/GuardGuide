<?php

use App\Models\Customer;
use App\Models\OrganizationalUnit;
use App\Models\Site;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

test('customers are persisted with uuid primary keys and minimum fields', function () {
    $company = OrganizationalUnit::factory()->company()->create([
        'name' => 'SecPal Holding',
    ]);
    $customer = Customer::factory()->create([
        'organizational_unit_id' => $company->getKey(),
        'name' => 'Acme Security GmbH',
    ]);

    expect($customer->getKey())->toBeString()
        ->and($customer->getIncrementing())->toBeFalse()
        ->and($customer->name)->toBe('Acme Security GmbH')
        ->and($customer->organizationalUnit->is($company))->toBeTrue();

    $this->assertDatabaseHas('customers', [
        'id' => $customer->getKey(),
        'organizational_unit_id' => $company->getKey(),
        'name' => 'Acme Security GmbH',
    ]);
});

test('customers require a name', function () {
    Customer::factory()->create([
        'name' => ' ',
    ]);
})->throws(DomainException::class, 'requires a name');

test('customers require a valid organizational unit foreign key', function () {
    DB::table('customers')->insert([
        'id' => (string) Str::uuid(),
        'organizational_unit_id' => (string) Str::uuid(),
        'name' => 'Unknown Company Customer',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
})->throws(QueryException::class);

test('sites belong to exactly one customer', function () {
    $customer = Customer::factory()->create();
    $site = Site::factory()->forCustomer($customer)->create([
        'name' => 'Werk Nord',
    ]);

    expect($site->getKey())->toBeString()
        ->and($site->getIncrementing())->toBeFalse()
        ->and($site->customer->is($customer))->toBeTrue()
        ->and($customer->sites->pluck('id')->all())->toBe([$site->getKey()]);

    $this->assertDatabaseHas('sites', [
        'id' => $site->getKey(),
        'customer_id' => $customer->getKey(),
        'organizational_unit_id' => null,
        'name' => 'Werk Nord',
    ]);
});

test('sites may optionally reference an internal organizational unit', function () {
    $unit = OrganizationalUnit::factory()->create([
        'name' => 'Objektleitung Nord',
    ]);
    $site = Site::factory()->managedBy($unit)->create();

    expect($site->organizationalUnit->is($unit))->toBeTrue();

    $this->assertDatabaseHas('sites', [
        'id' => $site->getKey(),
        'organizational_unit_id' => $unit->getKey(),
    ]);
});

test('sites can be persisted without an internal organizational unit', function () {
    $site = Site::factory()->withoutOrganizationalUnit()->create();

    expect($site->organizational_unit_id)->toBeNull()
        ->and($site->organizationalUnit)->toBeNull();
});

test('sites require a name', function () {
    Site::factory()->create([
        'name' => '',
    ]);
})->throws(DomainException::class, 'requires a name');

test('sites require a customer', function () {
    Site::factory()->create([
        'customer_id' => null,
    ]);
})->throws(DomainException::class, 'requires a customer');

test('sites reject invalid customer foreign keys', function () {
    DB::table('sites')->insert([
        'id' => (string) Str::uuid(),
        'customer_id' => (string) Str::uuid(),
        'organizational_unit_id' => null,
        'name' => 'Unknown Customer Site',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
})->throws(QueryException::class);

test('sites reject invalid organizational unit foreign keys', function () {
    $customer = Customer::factory()->create();

    DB::table('sites')->insert([
        'id' => (string) Str::uuid(),
        'customer_id' => $customer->getKey(),
        'organizational_unit_id' => (string) Str::uuid(),
        'name' => 'Unknown Unit Site',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
})->throws(QueryException::class);

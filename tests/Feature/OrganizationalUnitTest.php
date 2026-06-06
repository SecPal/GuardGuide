<?php

use App\Enums\OrganizationalUnitType;
use App\Models\OrganizationalUnit;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

test('root organizational units are persisted with uuid primary keys', function () {
    $unit = OrganizationalUnit::factory()->root()->create([
        'type' => OrganizationalUnitType::Division,
        'name' => 'SecPal Operations',
        'sort_order' => 10,
    ]);

    expect($unit->getKey())->toBeString()
        ->and($unit->getIncrementing())->toBeFalse()
        ->and($unit->type)->toBe(OrganizationalUnitType::Division)
        ->and($unit->parent_id)->toBeNull()
        ->and($unit->sort_order)->toBe(10);

    $this->assertDatabaseHas('organizational_units', [
        'id' => $unit->getKey(),
        'type' => OrganizationalUnitType::Division->value,
        'name' => 'SecPal Operations',
        'parent_id' => null,
    ]);
});

test('child organizational units belong to a parent and are sorted within siblings', function () {
    $root = OrganizationalUnit::factory()->root()->create([
        'name' => 'SecPal',
        'sort_order' => 0,
    ]);
    $second = OrganizationalUnit::factory()->childOf($root)->create([
        'name' => 'B Services',
        'sort_order' => 20,
    ]);
    $first = OrganizationalUnit::factory()->childOf($root)->create([
        'name' => 'A Services',
        'sort_order' => 10,
    ]);

    expect($first->parent->is($root))->toBeTrue()
        ->and($root->children->pluck('id')->all())->toBe([
            $first->getKey(),
            $second->getKey(),
        ]);
});

test('organizational unit types are limited by the domain enum', function (OrganizationalUnitType $type) {
    $unit = OrganizationalUnit::factory()->create([
        'type' => $type,
    ]);

    expect($unit->type)->toBe($type);
})->with(OrganizationalUnitType::cases());

test('invalid organizational unit types are rejected by the model', function () {
    OrganizationalUnit::factory()->create([
        'type' => 'branch-office',
    ]);
})->throws(ValueError::class);

test('organizational units require a name', function () {
    OrganizationalUnit::factory()->create([
        'name' => '   ',
    ]);
})->throws(DomainException::class, 'requires a name');

test('invalid organizational unit types are rejected by the database', function () {
    DB::table('organizational_units')->insert([
        'id' => (string) Str::uuid(),
        'type' => 'branch-office',
        'name' => 'Invalid Unit',
        'parent_id' => null,
        'sort_order' => 0,
        'created_at' => now(),
        'updated_at' => now(),
    ]);
})->throws(QueryException::class);

test('organizational units cannot be their own parent', function () {
    $unit = OrganizationalUnit::factory()->create();

    $unit->parent_id = $unit->getKey();
    $unit->save();
})->throws(DomainException::class, 'own parent');

test('organizational units cannot create cyclic parent relationships', function () {
    $root = OrganizationalUnit::factory()->create();
    $child = OrganizationalUnit::factory()->childOf($root)->create();
    $grandchild = OrganizationalUnit::factory()->childOf($child)->create();

    $root->parent_id = $grandchild->getKey();
    $root->save();
})->throws(DomainException::class, 'descendants');

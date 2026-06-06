<?php

use App\Enums\OrganizationalUnitType;
use App\Models\OrganizationalUnit;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;

test('guests are redirected from the organizational unit page', function () {
    $this->get(route('organizational-units.index'))
        ->assertRedirect(route('login'));
});

test('unverified users are redirected from the organizational unit page', function () {
    $this->skipUnlessFortifyHas(Features::emailVerification());

    $user = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->get(route('organizational-units.index'))
        ->assertRedirect(route('verification.notice'));
});

test('authenticated users can view organizational units as a hierarchy', function () {
    $root = OrganizationalUnit::factory()->root()->create([
        'type' => OrganizationalUnitType::Company,
        'name' => 'SecPal',
        'sort_order' => 0,
    ]);
    $child = OrganizationalUnit::factory()->childOf($root)->create([
        'type' => OrganizationalUnitType::Department,
        'name' => 'Guard Operations',
        'sort_order' => 10,
    ]);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('organizational-units.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('organizational-units/index')
            ->has('typeOptions', count(OrganizationalUnitType::cases()))
            ->has('flatUnits', 2)
            ->where('units.0.id', $root->getKey())
            ->where('units.0.name', 'SecPal')
            ->where('units.0.children.0.id', $child->getKey())
            ->where('units.0.children.0.name', 'Guard Operations'),
        );
});

test('organizational units can be created on root level', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('organizational-units.store'), [
            'type' => OrganizationalUnitType::Division->value,
            'name' => 'New Division',
            'parent_id' => null,
            'sort_order' => 5,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('organizational-units.index'));

    $this->assertDatabaseHas('organizational_units', [
        'type' => OrganizationalUnitType::Division->value,
        'name' => 'New Division',
        'parent_id' => null,
        'sort_order' => 5,
    ]);
});

test('organizational units can be created below an existing unit', function () {
    $parent = OrganizationalUnit::factory()->root()->create();
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('organizational-units.store'), [
            'type' => OrganizationalUnitType::Team->value,
            'name' => 'Response Team',
            'parent_id' => $parent->getKey(),
            'sort_order' => 20,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('organizational-units.index'));

    $this->assertDatabaseHas('organizational_units', [
        'type' => OrganizationalUnitType::Team->value,
        'name' => 'Response Team',
        'parent_id' => $parent->getKey(),
        'sort_order' => 20,
    ]);
});

test('organizational units can be edited', function () {
    $unit = OrganizationalUnit::factory()->root()->create();
    $user = User::factory()->create();

    $this->actingAs($user)
        ->put(route('organizational-units.update', $unit), [
            'type' => OrganizationalUnitType::Department->value,
            'name' => 'Updated Department',
            'parent_id' => null,
            'sort_order' => 15,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('organizational-units.index'));

    expect($unit->refresh())
        ->type->toBe(OrganizationalUnitType::Department)
        ->name->toBe('Updated Department')
        ->parent_id->toBeNull()
        ->sort_order->toBe(15);
});

test('organizational units can be moved within the hierarchy', function () {
    $oldParent = OrganizationalUnit::factory()->root()->create(['name' => 'Old Parent']);
    $newParent = OrganizationalUnit::factory()->root()->create(['name' => 'New Parent']);
    $child = OrganizationalUnit::factory()->childOf($oldParent)->create(['name' => 'Movable Team']);
    $user = User::factory()->create();

    $this->actingAs($user)
        ->put(route('organizational-units.update', $child), [
            'type' => $child->type->value,
            'name' => $child->name,
            'parent_id' => $newParent->getKey(),
            'sort_order' => 30,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('organizational-units.index'));

    expect($child->refresh())
        ->parent_id->toBe($newParent->getKey())
        ->sort_order->toBe(30);
});

test('organizational units cannot be moved below their descendants through the UI endpoint', function () {
    $root = OrganizationalUnit::factory()->root()->create();
    $child = OrganizationalUnit::factory()->childOf($root)->create();
    $grandchild = OrganizationalUnit::factory()->childOf($child)->create();
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('organizational-units.index'))
        ->put(route('organizational-units.update', $root), [
            'type' => $root->type->value,
            'name' => $root->name,
            'parent_id' => $grandchild->getKey(),
            'sort_order' => $root->sort_order,
        ])
        ->assertSessionHasErrors('parent_id')
        ->assertRedirect(route('organizational-units.index'));

    expect($root->refresh()->parent_id)->toBeNull();
});

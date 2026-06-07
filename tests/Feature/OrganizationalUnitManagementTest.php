<?php

use App\Auth\GuardGuideAccessCatalog;
use App\Enums\OrganizationalUnitType;
use App\Models\OrganizationalUnit;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;

function organizationalUnitManager(array $attributes = []): User
{
    return grantPermissions(
        User::factory()->create($attributes),
        GuardGuideAccessCatalog::ORGANIZATIONAL_UNITS_VIEW,
        GuardGuideAccessCatalog::ORGANIZATIONAL_UNITS_CREATE,
        GuardGuideAccessCatalog::ORGANIZATIONAL_UNITS_UPDATE,
    );
}

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

test('users without organizational unit permissions cannot view or modify organizational units', function () {
    $user = User::factory()->create();
    $unit = OrganizationalUnit::factory()->root()->create();

    $this->actingAs($user)
        ->get(route('organizational-units.index'))
        ->assertForbidden();

    $this->actingAs($user)
        ->post(route('organizational-units.store'), [
            'type' => OrganizationalUnitType::Division->value,
            'name' => 'Should Not Persist',
            'parent_id' => null,
            'sort_order' => 0,
        ])
        ->assertForbidden();

    $this->actingAs($user)
        ->put(route('organizational-units.update', $unit), [
            'type' => $unit->type->value,
            'name' => 'Should Not Update',
            'parent_id' => null,
            'sort_order' => 0,
        ])
        ->assertForbidden();

    $this->assertDatabaseMissing('organizational_units', ['name' => 'Should Not Persist']);
    $this->assertDatabaseMissing('organizational_units', ['name' => 'Should Not Update']);
});

test('organizational unit view permission does not allow writes', function () {
    $user = grantPermissions(
        User::factory()->create(),
        GuardGuideAccessCatalog::ORGANIZATIONAL_UNITS_VIEW,
    );
    $unit = OrganizationalUnit::factory()->root()->create();

    $this->actingAs($user)
        ->get(route('organizational-units.index'))
        ->assertOk();

    $this->actingAs($user)
        ->post(route('organizational-units.store'), [
            'type' => OrganizationalUnitType::Division->value,
            'name' => 'View Only Division',
            'parent_id' => null,
            'sort_order' => 0,
        ])
        ->assertForbidden();

    $this->actingAs($user)
        ->put(route('organizational-units.update', $unit), [
            'type' => $unit->type->value,
            'name' => 'View Only Update',
            'parent_id' => null,
            'sort_order' => 0,
        ])
        ->assertForbidden();
});

test('users with organizational unit view permission can view organizational units as a hierarchy', function () {
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

    $user = organizationalUnitManager();

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

test('organizational units with soft-deleted parents remain visible in the hierarchy', function () {
    $deletedParent = OrganizationalUnit::factory()->root()->create([
        'name' => 'Archived Company',
        'sort_order' => 0,
    ]);
    $orphanChild = OrganizationalUnit::factory()->childOf($deletedParent)->create([
        'name' => 'Visible Division',
        'sort_order' => 10,
    ]);
    $grandchild = OrganizationalUnit::factory()->childOf($orphanChild)->create([
        'name' => 'Visible Team',
        'sort_order' => 20,
    ]);
    $deletedParent->delete();

    $user = organizationalUnitManager();

    $this->actingAs($user)
        ->get(route('organizational-units.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('organizational-units/index')
            ->has('units', 1)
            ->has('flatUnits', 2)
            ->where('units.0.id', $orphanChild->getKey())
            ->where('units.0.children.0.id', $grandchild->getKey())
            ->where('flatUnits.0.id', $orphanChild->getKey())
            ->where('flatUnits.0.depth', 0)
            ->where('flatUnits.1.id', $grandchild->getKey())
            ->where('flatUnits.1.depth', 1),
        );
});

test('organizational units can be created on root level', function () {
    $user = organizationalUnitManager();

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
    $user = organizationalUnitManager();

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

test('organizational units surface hierarchy validation errors when created through the UI endpoint', function () {
    $root = OrganizationalUnit::factory()->root()->create();
    $child = OrganizationalUnit::factory()->childOf($root)->create();
    $user = organizationalUnitManager();

    OrganizationalUnit::query()
        ->withoutGlobalScopes()
        ->whereKey($root->getKey())
        ->update(['parent_id' => $child->getKey()]);

    $this->actingAs($user)
        ->from(route('organizational-units.index'))
        ->post(route('organizational-units.store'), [
            'type' => OrganizationalUnitType::Team->value,
            'name' => 'Cycle Child',
            'parent_id' => $root->getKey(),
            'sort_order' => 25,
        ])
        ->assertSessionHasErrors('parent_id')
        ->assertRedirect(route('organizational-units.index'));

    $this->assertDatabaseMissing('organizational_units', [
        'name' => 'Cycle Child',
    ]);
});

test('organizational units reject whitespace-only names through the UI endpoint', function () {
    $user = organizationalUnitManager();

    $this->actingAs($user)
        ->from(route('organizational-units.index'))
        ->post(route('organizational-units.store'), [
            'type' => OrganizationalUnitType::Division->value,
            'name' => '   ',
            'parent_id' => null,
            'sort_order' => 5,
        ])
        ->assertSessionHasErrors('name')
        ->assertRedirect(route('organizational-units.index'));

    $this->assertDatabaseMissing('organizational_units', [
        'type' => OrganizationalUnitType::Division->value,
        'name' => '   ',
        'sort_order' => 5,
    ]);
});

test('organizational units can be edited', function () {
    $unit = OrganizationalUnit::factory()->root()->create();
    $user = organizationalUnitManager();

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

test('organizational units can be edited when their parent is soft deleted', function () {
    $deletedParent = OrganizationalUnit::factory()->root()->create(['name' => 'Archived Company']);
    $unit = OrganizationalUnit::factory()->childOf($deletedParent)->create(['name' => 'Visible Division']);
    $user = organizationalUnitManager();

    $deletedParent->delete();

    $this->actingAs($user)
        ->put(route('organizational-units.update', $unit), [
            'type' => OrganizationalUnitType::Department->value,
            'name' => 'Updated Division',
            'parent_id' => $deletedParent->getKey(),
            'sort_order' => 15,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('organizational-units.index'));

    expect($unit->refresh())
        ->type->toBe(OrganizationalUnitType::Department)
        ->name->toBe('Updated Division')
        ->parent_id->toBe($deletedParent->getKey())
        ->sort_order->toBe(15);
});

test('organizational units can be moved within the hierarchy', function () {
    $oldParent = OrganizationalUnit::factory()->root()->create(['name' => 'Old Parent']);
    $newParent = OrganizationalUnit::factory()->root()->create(['name' => 'New Parent']);
    $child = OrganizationalUnit::factory()->childOf($oldParent)->create(['name' => 'Movable Team']);
    $user = organizationalUnitManager();

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
    $user = organizationalUnitManager();

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

<?php

use App\Auth\GuardGuideAccessCatalog;
use App\Models\User;
use Database\Seeders\GuardGuideAccessSeeder;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;
use Spatie\Permission\Models\Role;

function roleManager(array $attributes = []): User
{
    return grantPermissions(
        User::factory()->create($attributes),
        GuardGuideAccessCatalog::ROLES_VIEW,
        GuardGuideAccessCatalog::ROLES_CREATE,
        GuardGuideAccessCatalog::ROLES_UPDATE,
        GuardGuideAccessCatalog::ROLES_DELETE,
    );
}

test('guests are redirected from the role management page', function () {
    $this->get(route('roles.index'))
        ->assertRedirect(route('login'));
});

test('unverified users are redirected from the role management page', function () {
    $this->skipUnlessFortifyHas(Features::emailVerification());

    $user = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->get(route('roles.index'))
        ->assertRedirect(route('verification.notice'));
});

test('users without role permissions cannot access role management', function () {
    $this->seed(GuardGuideAccessSeeder::class);

    $actingUser = User::factory()->create();
    $role = Role::findByName(
        GuardGuideAccessCatalog::ROLE_OPERATIONS_USER,
        GuardGuideAccessCatalog::GUARD,
    );

    $this->actingAs($actingUser)
        ->get(route('roles.index'))
        ->assertForbidden();

    $this->actingAs($actingUser)
        ->post(route('roles.store'), [
            'name' => 'dispatch-coordinator',
            'label' => 'Dispatch coordinator',
            'permissions' => [GuardGuideAccessCatalog::SITES_VIEW],
        ])
        ->assertForbidden();

    $this->actingAs($actingUser)
        ->put(route('roles.update', $role), [
            'name' => $role->name,
            'label' => 'Changed label',
            'permissions' => [GuardGuideAccessCatalog::SITES_VIEW],
        ])
        ->assertForbidden();

    $this->actingAs($actingUser)
        ->delete(route('roles.destroy', $role))
        ->assertForbidden();
});

test('users with view permission can see the role overview', function () {
    $this->seed(GuardGuideAccessSeeder::class);

    $actingUser = grantPermissions(
        User::factory()->create(),
        GuardGuideAccessCatalog::ROLES_VIEW,
    );

    $this->actingAs($actingUser)
        ->get(route('roles.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('roles/index')
            ->has('roles', count(GuardGuideAccessCatalog::roles()))
            ->where('roles.0.label', 'Customer management')
            ->where('permissions.0.name', GuardGuideAccessCatalog::ORGANIZATIONAL_UNITS_VIEW)
            ->where('capabilities.create', false)
            ->where('capabilities.update', false)
            ->where('capabilities.delete', false),
        );
});

test('capabilities flags reflect the policy correctly for a full role manager', function () {
    $this->seed(GuardGuideAccessSeeder::class);

    $actingUser = roleManager();

    $this->actingAs($actingUser)
        ->get(route('roles.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('capabilities.create', true)
            ->where('capabilities.update', true)
            ->where('capabilities.delete', true),
        );
});

test('roles can be created and updated through the management endpoints', function () {
    $this->seed(GuardGuideAccessSeeder::class);

    $actingUser = roleManager();

    $this->actingAs($actingUser)
        ->post(route('roles.store'), [
            'name' => 'dispatch-coordinator',
            'label' => 'Dispatch coordinator',
            'permissions' => [
                GuardGuideAccessCatalog::CUSTOMERS_VIEW,
                GuardGuideAccessCatalog::SITES_VIEW,
            ],
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('roles.index'));

    $role = Role::findByName('dispatch-coordinator', GuardGuideAccessCatalog::GUARD);

    expect($role->label)->toBe('Dispatch coordinator')
        ->and($role->permissions->pluck('name')->sort()->values()->all())
        ->toBe([
            GuardGuideAccessCatalog::CUSTOMERS_VIEW,
            GuardGuideAccessCatalog::SITES_VIEW,
        ]);

    $this->actingAs($actingUser)
        ->put(route('roles.update', $role), [
            'name' => 'dispatch-lead',
            'label' => 'Dispatch lead',
            'permissions' => [
                GuardGuideAccessCatalog::CUSTOMERS_VIEW,
                GuardGuideAccessCatalog::SITES_VIEW,
                GuardGuideAccessCatalog::WORKFLOWS_VIEW,
            ],
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('roles.index'));

    expect($role->refresh()->name)->toBe('dispatch-lead')
        ->and($role->label)->toBe('Dispatch lead')
        ->and($role->permissions->pluck('name')->sort()->values()->all())
        ->toBe([
            GuardGuideAccessCatalog::CUSTOMERS_VIEW,
            GuardGuideAccessCatalog::SITES_VIEW,
            GuardGuideAccessCatalog::WORKFLOWS_VIEW,
        ]);
});

test('seeded roles cannot be updated through the management endpoint', function () {
    $this->seed(GuardGuideAccessSeeder::class);

    $actingUser = roleManager();
    $role = Role::findByName(
        GuardGuideAccessCatalog::ROLE_PLATFORM_ADMINISTRATOR,
        GuardGuideAccessCatalog::GUARD,
    );
    $originalPermissions = $role->permissions->pluck('name')->sort()->values()->all();

    $this->actingAs($actingUser)
        ->put(route('roles.update', $role), [
            'name' => 'renamed-platform-admin',
            'label' => 'Renamed platform admin',
            'permissions' => [GuardGuideAccessCatalog::ROLES_VIEW],
        ])
        ->assertForbidden();

    expect($role->refresh()->name)->toBe(GuardGuideAccessCatalog::ROLE_PLATFORM_ADMINISTRATOR)
        ->and($role->label)->toBe('Platform administration')
        ->and($role->permissions->pluck('name')->sort()->values()->all())
        ->toBe($originalPermissions);
});

test('seeded roles cannot be deleted through the management endpoint', function () {
    $this->seed(GuardGuideAccessSeeder::class);

    $actingUser = roleManager();
    $role = Role::findByName(
        GuardGuideAccessCatalog::ROLE_PLATFORM_ADMINISTRATOR,
        GuardGuideAccessCatalog::GUARD,
    );

    $this->actingAs($actingUser)
        ->delete(route('roles.destroy', $role))
        ->assertForbidden();

    expect(Role::query()->whereKey($role->getKey())->exists())->toBeTrue();
});

test('assigned roles cannot be deleted', function () {
    $this->seed(GuardGuideAccessSeeder::class);

    $actingUser = roleManager();
    $assignedUser = User::factory()->create();
    $role = Role::findByName(
        GuardGuideAccessCatalog::ROLE_OPERATIONS_USER,
        GuardGuideAccessCatalog::GUARD,
    );

    $assignedUser->assignRole($role);

    $this->actingAs($actingUser)
        ->delete(route('roles.destroy', $role))
        ->assertSessionHasErrors('role');

    expect(Role::query()->whereKey($role->getKey())->exists())->toBeTrue();
});

test('unassigned roles can be deleted', function () {
    $this->seed(GuardGuideAccessSeeder::class);

    $actingUser = roleManager();
    $role = Role::create([
        'name' => 'temporary-role',
        'label' => 'Temporary role',
        'guard_name' => GuardGuideAccessCatalog::GUARD,
    ]);

    $this->actingAs($actingUser)
        ->delete(route('roles.destroy', $role))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('roles.index'));

    expect(Role::query()->whereKey($role->getKey())->exists())->toBeFalse();
});

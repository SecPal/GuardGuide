<?php

use App\Auth\GuardGuideAccessCatalog;
use App\Models\User;
use Database\Seeders\GuardGuideAccessSeeder;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;
use Spatie\Permission\Models\Role;

function userRoleManager(array $attributes = []): User
{
    return grantPermissions(
        User::factory()->create($attributes),
        GuardGuideAccessCatalog::USER_ROLES_VIEW,
        GuardGuideAccessCatalog::USER_ROLES_MANAGE,
    );
}

test('guests are redirected from the user role page', function () {
    $user = User::factory()->create();

    $this->get(route('user-roles.index', $user))
        ->assertRedirect(route('login'));
});

test('unverified users are redirected from the user role page', function () {
    $this->skipUnlessFortifyHas(Features::emailVerification());

    $user = User::factory()->unverified()->create();

    $this->actingAs($user)
        ->get(route('user-roles.index', $user))
        ->assertRedirect(route('verification.notice'));
});

test('users without role management permissions cannot view or manage user roles', function () {
    $this->seed(GuardGuideAccessSeeder::class);

    $actingUser = User::factory()->create();
    $selectedUser = User::factory()->create();
    $role = Role::findByName(GuardGuideAccessCatalog::ROLE_OPERATIONS_USER, GuardGuideAccessCatalog::GUARD);

    $this->actingAs($actingUser)
        ->get(route('user-roles.index', $selectedUser))
        ->assertForbidden();

    $this->actingAs($actingUser)
        ->get(route('user-roles.redirect'))
        ->assertForbidden();

    $this->actingAs($actingUser)
        ->post(route('user-roles.store', $selectedUser), [
            'role_id' => $role->getKey(),
        ])
        ->assertForbidden();

    $selectedUser->assignRole($role);

    $this->actingAs($actingUser)
        ->delete(route('user-roles.destroy', [$selectedUser, $role]))
        ->assertForbidden();

    expect($selectedUser->refresh()->hasRole($role))->toBeTrue();
});

test('role view permission shows assigned roles without allowing changes', function () {
    $this->seed(GuardGuideAccessSeeder::class);

    $actingUser = grantPermissions(
        User::factory()->create(['name' => 'Viewer']),
        GuardGuideAccessCatalog::USER_ROLES_VIEW,
    );
    $selectedUser = User::factory()->create([
        'name' => 'Mira Admin',
        'email' => 'mira@example.test',
    ]);
    $role = Role::findByName(GuardGuideAccessCatalog::ROLE_OPERATIONS_USER, GuardGuideAccessCatalog::GUARD);

    $selectedUser->assignRole($role);

    $this->actingAs($actingUser)
        ->get(route('user-roles.index', $selectedUser))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('user-roles/index')
            ->where('selectedUser.id', $selectedUser->getKey())
            ->where('selectedUser.name', 'Mira Admin')
            ->where('assignments.roles.0.name', GuardGuideAccessCatalog::ROLE_OPERATIONS_USER)
            ->where('assignments.roles.0.label', 'Operational usage')
            ->where('canManageRoles', false),
        );

    $this->actingAs($actingUser)
        ->post(route('user-roles.store', $selectedUser), [
            'role_id' => $role->getKey(),
        ])
        ->assertForbidden();
});

test('users with role management permission can view role assignments for a user', function () {
    $this->seed(GuardGuideAccessSeeder::class);

    $selectedUser = User::factory()->create([
        'name' => 'Mira Admin',
        'email' => 'mira@example.test',
    ]);
    $actingUser = userRoleManager();
    $role = Role::findByName(GuardGuideAccessCatalog::ROLE_OPERATIONS_USER, GuardGuideAccessCatalog::GUARD);

    $selectedUser->assignRole($role);

    $this->actingAs($actingUser)
        ->get(route('user-roles.index', $selectedUser))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('user-roles/index')
            ->where('selectedUser.id', $selectedUser->getKey())
            ->where('selectedUser.email', 'mira@example.test')
            ->has('users', 2)
            ->where('assignments.roles.0.id', $role->getKey())
            ->where('assignments.roles.0.name', GuardGuideAccessCatalog::ROLE_OPERATIONS_USER)
            ->where('assignments.roles.0.label', 'Operational usage')
            ->has('options.roles', count(GuardGuideAccessCatalog::roles()))
            ->where('canManageRoles', true),
        );
});

test('role landing redirect is forbidden before any db query when caller lacks the permission', function () {
    // Regression: gate must be evaluated before the firstOrFail() query so that
    // an unauthorized caller receives 403, not 404, regardless of whether any
    // users exist in the database.
    $actingUser = User::factory()->create();

    // Delete all other users so the table would otherwise return no rows.
    User::where('id', '!=', $actingUser->getKey())->delete();

    $this->actingAs($actingUser)
        ->get(route('user-roles.redirect'))
        ->assertForbidden();
});

test('role landing route redirects to the first user', function () {
    $zUser = userRoleManager(['name' => 'Zoe']);
    $aUser = User::factory()->create(['name' => 'Ada']);

    $this->actingAs($zUser)
        ->get(route('user-roles.redirect'))
        ->assertRedirect(route('user-roles.index', $aUser));
});

test('roles can be assigned and removed through the UI endpoint', function () {
    $this->seed(GuardGuideAccessSeeder::class);

    $actingUser = userRoleManager();
    $selectedUser = User::factory()->create();
    $role = Role::findByName(GuardGuideAccessCatalog::ROLE_SITE_MANAGER, GuardGuideAccessCatalog::GUARD);

    $this->actingAs($actingUser)
        ->post(route('user-roles.store', $selectedUser), [
            'role_id' => $role->getKey(),
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('user-roles.index', $selectedUser));

    expect($selectedUser->refresh()->hasRole($role))->toBeTrue();

    $this->actingAs($actingUser)
        ->delete(route('user-roles.destroy', [$selectedUser, $role]))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('user-roles.index', $selectedUser));

    expect($selectedUser->refresh()->hasRole($role))->toBeFalse();
});

<?php

use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

test('users can receive web guard roles and evaluate assigned permissions', function () {
    $user = User::factory()->create();
    $role = Role::create([
        'name' => 'instruction-manager',
        'guard_name' => 'web',
    ]);
    $permission = Permission::create([
        'name' => 'instructions.publish',
        'guard_name' => 'web',
    ]);

    $role->givePermissionTo($permission);
    $user->assignRole($role);

    expect($role->guard_name)->toBe('web')
        ->and($permission->guard_name)->toBe('web')
        ->and($user->can('instructions.publish'))->toBeTrue();
});

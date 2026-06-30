<?php

namespace Tests\Fixtures\Auth;

use App\Auth\GuardGuideAccessCatalog;
use App\Auth\RolePermissionSource;

final class TestRolePermissionSource implements RolePermissionSource
{
    public function guardName(): string
    {
        return GuardGuideAccessCatalog::GUARD;
    }

    /**
     * @return array<string, string>
     */
    public function permissions(): array
    {
        return [
            'test.permission' => 'Test permission supplied by configured source.',
        ];
    }

    /**
     * @return array<string, array{name: string, permissions: list<string>}>
     */
    public function roles(): array
    {
        return [
            'test-role' => [
                'name' => 'Test role',
                'permissions' => ['test.permission'],
            ],
        ];
    }
}

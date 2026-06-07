<?php

namespace App\Auth;

/**
 * Provides the role and permission definitions GuardGuide synchronizes locally.
 */
interface RolePermissionSource
{
    public function guardName(): string;

    /**
     * @return array<string, string>
     */
    public function permissions(): array;

    /**
     * @return array<string, array{name: string, permissions: list<string>}>
     */
    public function roles(): array;
}

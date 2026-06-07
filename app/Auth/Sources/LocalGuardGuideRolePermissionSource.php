<?php

namespace App\Auth\Sources;

use App\Auth\GuardGuideAccessCatalog;
use App\Auth\RolePermissionSource;

/**
 * Standalone role and permission source backed by GuardGuide's local catalog.
 */
final class LocalGuardGuideRolePermissionSource implements RolePermissionSource
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
        return GuardGuideAccessCatalog::permissions();
    }

    /**
     * @return array<string, array{name: string, permissions: list<string>}>
     */
    public function roles(): array
    {
        return GuardGuideAccessCatalog::roles();
    }
}

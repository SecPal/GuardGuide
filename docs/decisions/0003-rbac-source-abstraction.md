<!--
SPDX-FileCopyrightText: 2026 SecPal Contributors
SPDX-License-Identifier: CC0-1.0
-->

# Decision 0003: RBAC Source Abstraction

## Status

Accepted

## Context

GuardGuide currently runs standalone and stores roles and permissions in its local Spatie RBAC
tables. The stable GuardGuide role and permission names live in a first-party catalog so policies,
middleware, seeders, and tests can refer to one local vocabulary.

Later SecPal integration may provide role, permission, or policy defaults. That integration is not
part of the current slice, and standalone GuardGuide must not assume that SecPal is available.

## Decision

GuardGuide resolves role and permission definitions through the `App\Auth\RolePermissionSource`
contract. The default configured source is `local`, implemented by
`App\Auth\Sources\LocalGuardGuideRolePermissionSource`, which delegates to the standalone
`GuardGuideAccessCatalog`.

The `GuardGuideAccessSeeder` synchronizes Spatie records from the configured source. In standalone
installations this means all roles, permissions, policies, and role checks continue to use only local
GuardGuide data.

A future SecPal-backed source or synchronization adapter should be added as another
`RolePermissionSource` implementation and registered in `config/guardguide_access.php`. Selecting
that source is the intended integration point; policies and controllers should continue to depend on
stable GuardGuide permission names instead of calling SecPal directly.

## Consequences

- standalone GuardGuide remains the default and has no external authorization dependency
- the source of RBAC definitions is explicit in configuration
- future SecPal adoption can start behind the source contract without rewriting the seeder or policy
  layer
- this decision does not implement live SecPal synchronization, conflict resolution, or remote role
  assignment import

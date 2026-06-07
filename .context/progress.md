<!--
SPDX-FileCopyrightText: 2026 SecPal Contributors
SPDX-License-Identifier: CC0-1.0
-->

## Codebase Patterns

- Architecture decisions live in `docs/decisions` as numbered Markdown records with SPDX comments,
  `Status`, `Context`, `Decision`, and `Consequences` sections.
- GuardGuide Laravel domain models use UUID primary keys via `HasUuids`, PHP enums for stable domain
  values, factories under `database/factories`, and Pest feature tests with `RefreshDatabase` for
  persistence rules.
- GuardGuide model-level validation that must handle missing or blank Eloquent attributes should
  inspect `$model->getAttributes()` so PHPStan does not treat dynamic model properties as guaranteed
  non-null strings.
- GuardGuide Inertia pages are exposed through Laravel route middleware, render React pages under
  `resources/js/pages`, and Wayfinder refreshes typed route/action helpers during Vite builds.
- User-to-domain-target visibility rules are modeled as dedicated UUID assignment models/tables with
  explicit foreign keys and composite unique indexes, not as overloaded columns on `users`.
- Dependent UI choices, such as site assignments that require customer assignments, should be
  filtered in React for clarity and enforced again in Laravel validation for crafted requests.
- Context read models should keep direct and derived visibility explicit with source metadata so later
  authorization-sensitive features can consume one structure without losing why an item is available.
- Package-provided route middleware for Laravel 13 should be registered in `bootstrap/app.php` via
  `$middleware->alias(...)`, keeping provider discovery and route usage decoupled.
- Stable GuardGuide RBAC names should live in a first-party catalog class and be synchronized by an
  idempotent seeder so later policies, middleware, and tests can reference one documented source.
- RBAC-protected Inertia navigation should consume shared `auth.can` permission booleans derived from
  Laravel authorization, not model flags such as `users.is_admin`.
- User role-management pages should use Spatie role IDs for mutation endpoints while displaying
  stable labels from the first-party GuardGuide RBAC catalog.

## US-001: Domänenmodell für Organisationskontext festlegen

- Added an accepted ADR for the GuardGuide organization context domain model.
- Documented `organizational_units`, `customers` / `companies`, and `sites` / object targets as
  distinct entity groups with explicit relationships.
- Defined direct user assignment targets, rejected implicit inheritance between organizational units,
  customers, and sites, and captured intended primary key, parent-child, and deletion rules.
- Explicitly separated this first modeling step from later service-instruction, acknowledgement, and
  SecPal synchronization work.
- Files changed: `docs/decisions/0002-organization-context-domain-model.md`, `.context/progress.md`
- **Learnings for future iterations:**
  - Patterns discovered: GuardGuide ADRs are lightweight Markdown decision records under
    `docs/decisions`.
  - Gotchas encountered: `.context` is ignored locally, so progress notes are useful for workspace
    collaboration but are not part of the normal repository commit.

## US-002: Interne Organisationsstruktur persistent modellieren

- Implemented the `organizational_units` persistence slice with a UUID primary key, enum-backed
  `type`, `name`, nullable self-referencing `parent_id`, `sort_order`, timestamps, and soft deletes.
- Added the `OrganizationalUnit` Eloquent model with parent/children relationships, root scope,
  enum casting, and save-time guards for invalid types, self-parenting, and cyclic parent chains.
- Added the `OrganizationalUnitFactory` plus feature/unit coverage for root units, child units,
  allowed type values, database-level type rejection, self-parent rejection, and cycle rejection.
- Files changed: `app/Enums/OrganizationalUnitType.php`, `app/Models/OrganizationalUnit.php`,
  `database/factories/OrganizationalUnitFactory.php`,
  `database/migrations/2026_06_06_000000_create_organizational_units_table.php`,
  `tests/Feature/OrganizationalUnitTest.php`, `tests/Unit/OrganizationalUnitTypeTest.php`,
  `.context/progress.md`
- **Learnings for future iterations:**
  - Patterns discovered: Laravel 13 enum columns and enum casts work cleanly for GuardGuide domain
    value sets, while model `saving` hooks are a focused place for hierarchy invariants.
  - Gotchas encountered: Pest files run in the global namespace, so importing PHP global exception
    classes causes warnings; Pint normalizes those references back to plain class names.

## US-003: Organisationsstruktur im GuardGuide-UI sichtbar machen

- Added a protected organizational structure Inertia page with a sidebar navigation entry, hierarchical
  tree display, root/child creation, and selected-unit editing/moving controls.
- Added `OrganizationalUnitController` routes for index, create, and update operations with enum,
  parent, and sort-order validation plus cycle errors surfaced as validation messages.
- Added feature coverage for auth/verification access, hierarchy rendering, root and child creation,
  editing, moving, and rejecting descendant moves through the UI endpoint.
- Files changed: `app/Http/Controllers/OrganizationalUnitController.php`,
  `routes/web.php`, `resources/js/components/app-sidebar.tsx`,
  `resources/js/pages/organizational-units/index.tsx`,
  `resources/js/actions/App/Http/Controllers/OrganizationalUnitController.ts`,
  `resources/js/actions/App/Http/Controllers/index.ts`,
  `resources/js/routes/organizational-units/index.ts`,
  `tests/Feature/OrganizationalUnitManagementTest.php`, `.context/progress.md`
- **Learnings for future iterations:**
  - Patterns discovered: Inertia management pages can stay compact by sending both tree and flat
    option-list props from the controller while keeping hierarchy invariants centralized in the model.
  - Gotchas encountered: Running `composer test` while `npm run build` rewrites `public/build` can
    race Laravel's Vite manifest/font lookup; run those checks sequentially.

## US-004: Externe Firmen, Kunden und Objekte modellieren

- Implemented persistent `customers` and `sites` tables with UUID primary keys, soft deletes, required
  customer/site names, required `sites.customer_id`, and nullable `sites.organizational_unit_id`.
- Added `Customer` and `Site` Eloquent models with factories, relationships, and save-time guards for
  minimum required fields.
- Added feature coverage for customer persistence, site/customer ownership, optional internal
  organizational-unit responsibility, missing required fields, and invalid customer/unit foreign keys.
- Files changed: `app/Models/Customer.php`, `app/Models/Site.php`,
  `database/factories/CustomerFactory.php`, `database/factories/SiteFactory.php`,
  `database/migrations/2026_06_06_000001_create_customers_table.php`,
  `database/migrations/2026_06_06_000002_create_sites_table.php`,
  `tests/Feature/CustomerSiteTest.php`, `.context/progress.md`
- **Learnings for future iterations:**
  - Patterns discovered: Eloquent model guards for required scalar attributes should read raw
    attributes to catch omitted values while staying compatible with PHPStan's model-property types.
  - Gotchas encountered: The accepted ADR described `sites.organizational_unit_id` as required, but
    US-004 explicitly makes the internal organizational reference optional; the story criteria should
    drive this implementation slice.

## US-005: Nutzer-Zuordnungen zu Organisationen und Zielobjekten speichern

- Added separate user assignment persistence for internal organizational units, customers, and sites,
  each with a UUID primary key, explicit user/target foreign keys, timestamps, and composite unique
  constraints to reject duplicate identical assignments.
- Added assignment Eloquent models, factories, and relationship accessors on `User`,
  `OrganizationalUnit`, `Customer`, and `Site` so callers can use either assignment records or direct
  many-to-many target relations.
- Added feature coverage for assigning one user to multiple internal units, customers, and sites;
  removing assignments; rejecting duplicate assignments; and rejecting invalid users or target
  references.
- Files changed: `app/Models/User.php`, `app/Models/OrganizationalUnit.php`,
  `app/Models/Customer.php`, `app/Models/Site.php`,
  `app/Models/UserOrganizationalUnitAssignment.php`, `app/Models/UserCustomerAssignment.php`,
  `app/Models/UserSiteAssignment.php`,
  `database/factories/UserOrganizationalUnitAssignmentFactory.php`,
  `database/factories/UserCustomerAssignmentFactory.php`,
  `database/factories/UserSiteAssignmentFactory.php`,
  `database/migrations/2026_06_06_000003_create_user_assignment_tables.php`,
  `tests/Feature/UserAssignmentTest.php`, `.context/progress.md`
- **Learnings for future iterations:**
  - Patterns discovered: Assignment tables should stay narrow and enforce identity with database
    uniqueness while exposing both explicit assignment models and `belongsToMany` convenience
    relations.
  - Gotchas encountered: User IDs are still integer keys while the organization-context domain models
    use UUIDs, so assignment migrations need `foreignId('user_id')` and `foreignUuid(...)` target
    columns instead of assuming a uniform key type.

## US-006: Zuordnungen im UI verwalten

- Added a protected user-assignment management area with a stable sidebar entry, user switcher, and
  visible lists for organizational-unit, customer, and site assignments.
- Added Laravel endpoints for adding and removing organizational-unit, customer, and site
  assignments with Inertia flash messages and validation errors for duplicates, invalid targets, and
  site assignments without an existing customer assignment.
- Added UI filtering so site choices only appear when the selected user already has the related
  customer assignment; removing a customer assignment also removes its dependent site assignments.
- Added feature coverage for auth/verification access, page props, the landing redirect, add/remove
  flows, duplicate validation, and the customer-before-site rule.
- Files changed: `app/Http/Controllers/UserAssignmentController.php`, `routes/web.php`,
  `resources/js/components/app-sidebar.tsx`, `resources/js/pages/user-assignments/index.tsx`,
  `resources/js/actions/App/Http/Controllers/UserAssignmentController.ts`,
  `resources/js/actions/App/Http/Controllers/index.ts`,
  `resources/js/routes/user-assignments/index.ts`,
  `resources/js/routes/user-assignments/organizational-units/index.ts`,
  `resources/js/routes/user-assignments/customers/index.ts`,
  `resources/js/routes/user-assignments/sites/index.ts`,
  `tests/Feature/UserAssignmentManagementTest.php`, `.context/progress.md`
- **Learnings for future iterations:**
  - Patterns discovered: Assignment management pages can expose both assigned records and global
    options from one Inertia response, letting React filter already-selected and dependency-blocked
    choices without extra requests.
  - Gotchas encountered: PHPStan treats partially selected enum-cast Eloquent attributes as possibly
    raw strings, so controller serializers should normalize enum-or-string values through a helper.

## US-007: Verwendbaren Arbeitskontext für Folgefeatures auflösen

- Added a central `UserContextResolver` service that resolves effective organizational-unit,
  customer, and site contexts for a user.
- Exposed the resolved context as an authenticated Inertia shared prop named `effectiveContext` and
  added frontend TypeScript types for the shared data shape.
- Kept directly assigned and object-derived contexts source-aware; object assignments expose their
  assigned site plus the parent customer and responsible organizational unit when present.
- Added feature coverage for users without assignments, mixed direct assignments, object assignments,
  and shared Inertia props.
- Files changed: `app/Services/UserContextResolver.php`,
  `app/Http/Middleware/HandleInertiaRequests.php`, `resources/js/types/context.ts`,
  `resources/js/types/global.d.ts`, `resources/js/types/index.ts`,
  `tests/Feature/UserContextResolverTest.php`, `.context/progress.md`
- **Learnings for future iterations:**
  - Patterns discovered: Source-aware resolver output lets follow-up features consume one frontend
    structure while still distinguishing direct assignment from object-derived context.
  - Gotchas encountered: Laravel collections inferred with integer keys are a poor fit for UUID-keyed
    de-duplication under PHPStan; plain associative arrays make the intent and static type clearer.

## US-001: Spatie RBAC im Standalone-Modus bootstrappen

- Installed `spatie/laravel-permission` and published its standalone configuration and permission
  table migration for local roles and permissions.
- Registered Spatie's route middleware aliases in the Laravel app bootstrap and configured `User` to
  use the Spatie `HasRoles` trait with the existing `web` guard.
- Added feature coverage proving a `web`-guard role can grant a permission to a user and be evaluated
  successfully through Laravel's `can()` authorization path.
- Files changed: `composer.json`, `composer.lock`, `config/permission.php`,
  `database/migrations/2026_06_07_093257_create_permission_tables.php`, `bootstrap/app.php`,
  `app/Models/User.php`, `tests/Feature/UserRolePermissionTest.php`, `.context/progress.md`
- **Learnings for future iterations:**
  - Patterns discovered: Spatie can stay fully local to GuardGuide by using the package's default
    role and permission models, explicit `web` guard records, and Laravel bootstrap middleware
    aliases.
  - Gotchas encountered: The published Spatie v8 migration includes optional team-column handling for
    SQLite testing, so `permission.teams` must remain `false` for this standalone bootstrap slice.

## US-002: Standalone Berechtigungskatalog und Standardrollen definieren

- Added a documented GuardGuide RBAC catalog with web-guard permission names for organizational
  units, customers, sites, user assignments, and future workflows.
- Added an idempotent `GuardGuideAccessSeeder` that creates permissions and standard roles for
  platform administration, customer management, site management, and operational usage, then syncs
  role permissions back to the catalog on repeated runs.
- Wired the access seeder into `DatabaseSeeder` while keeping the default test user restricted to
  local and testing environments.
- Added feature tests for catalog creation, idempotent reseeding, expected role permissions, and
  `DatabaseSeeder` inclusion.
- Files changed: `app/Auth/GuardGuideAccessCatalog.php`,
  `database/seeders/GuardGuideAccessSeeder.php`, `database/seeders/DatabaseSeeder.php`,
  `tests/Feature/GuardGuideAccessSeederTest.php`, `.context/progress.md`
- **Learnings for future iterations:**
  - Patterns discovered: Stable role and permission strings are easiest to reuse safely when the
    catalog is separate from the seeder and tests assert against that same source.
  - Gotchas encountered: Spatie role permissions should be re-synchronized during seeding, not only
    attached, so repeated seed runs also correct catalog drift without creating duplicate records.

## US-003: Hart verdrahtetes Admin-Flag durch Berechtigungen ersetzen
- Replaced `OrganizationalUnitPolicy` and `UserAssignmentPolicy` checks with named GuardGuide
  catalog permissions and removed the model/factory convenience paths that treated `is_admin` as an
  authorization primitive.
- Exposed a small shared Inertia `auth.can` map for organizational-unit and user-assignment
  navigation, and switched the sidebar to those permission booleans.
- Updated the local/test default user seeding path to assign the platform administrator role instead
  of relying on the legacy admin flag.
- Reworked organizational-unit and user-assignment feature tests to grant explicit permissions,
  including boundary coverage for view-only users.
- Files changed: `app/Policies/OrganizationalUnitPolicy.php`,
  `app/Policies/UserAssignmentPolicy.php`, `app/Http/Middleware/HandleInertiaRequests.php`,
  `app/Models/User.php`, `database/factories/UserFactory.php`, `database/seeders/DatabaseSeeder.php`,
  `resources/js/components/app-sidebar.tsx`, `resources/js/types/auth.ts`, `tests/Pest.php`,
  `tests/Feature/OrganizationalUnitManagementTest.php`,
  `tests/Feature/UserAssignmentManagementTest.php`, `tests/Feature/UserAssignmentTest.php`,
  `tests/Feature/GuardGuideAccessSeederTest.php`, `.context/progress.md`
- **Learnings for future iterations:**
  - Patterns discovered: Server-side authorization and frontend navigation can share one small
    permission read model, keeping UI visibility aligned with Laravel policies without leaking legacy
    user columns.
  - Gotchas encountered: Local seeded users need real RBAC roles once policies stop reading
    `is_admin`; otherwise a development account can exist but no longer reach management routes.

## US-004: Rollen an Benutzer im GuardGuide zuweisen können
- Added dedicated `user_roles.view` and `user_roles.manage` catalog permissions, policy abilities,
  authenticated routes, and a `UserRoleController` for viewing, assigning, and removing Spatie roles
  on users.
- Added a GuardGuide Inertia/React user-role management page with user selection, current role
  display, role assignment, removal controls, sidebar navigation, translations, and generated
  Wayfinder helpers.
- Added feature tests for guest/unverified access, forbidden role-management access, view-only
  visibility, successful assignment, successful removal, and landing-route redirection.
- Files changed: `app/Auth/GuardGuideAccessCatalog.php`,
  `app/Http/Controllers/UserRoleController.php`,
  `app/Http/Middleware/HandleInertiaRequests.php`, `app/Policies/UserAssignmentPolicy.php`,
  `routes/web.php`, `resources/js/components/app-sidebar.tsx`,
  `resources/js/pages/user-roles/index.tsx`,
  `resources/js/actions/App/Http/Controllers/UserRoleController.ts`,
  `resources/js/actions/App/Http/Controllers/index.ts`, `resources/js/routes/index.ts`,
  `resources/js/routes/user-roles/index.ts`, `resources/js/types/auth.ts`,
  `resources/js/locales/de/messages.po`, `resources/js/locales/en/messages.po`,
  `tests/Feature/UserRoleManagementTest.php`, `.context/progress.md`
- **Learnings for future iterations:**
  - Patterns discovered: Role assignment mutations should bind roles by numeric Spatie IDs while
    resolving display names from `GuardGuideAccessCatalog::roles()` so UI labels can remain
    first-party and stable.
  - Gotchas encountered: `php artisan wayfinder:generate` needs `--with-form` in this project;
    otherwise it drops existing generated `.form()` helpers used by the Inertia form components.

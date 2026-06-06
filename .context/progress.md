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

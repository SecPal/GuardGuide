<!--
SPDX-FileCopyrightText: 2026 SecPal
SPDX-License-Identifier: CC0-1.0
-->

# Decision 0002: Organization Context Domain Model

## Status

Accepted

## Context

GuardGuide needs stable domain language for organization structure and target objects before database
migrations, authorization rules, and instruction publication flows are implemented.

SecPal already distinguishes internal organizational structure from external customer organizations
and physical service targets. GuardGuide follows that vocabulary so standalone mode can later map to
SecPal data without renaming core tables or types.

## Decision

GuardGuide uses three separate entity groups for organization context:

1. `organizational units` represent the operating organization's internal hierarchy.
2. `customers` / `companies` represent external legal or commercial organizations served by the
   operating organization.
3. `objects` / `sites` represent the concrete locations, facilities, event areas, or other target
   objects where instructions are relevant.

The canonical table and type names are:

- `organizational_units` for internal organization nodes
- `customers` for external customer or company records
- `sites` for object targets, with `object` retained as product vocabulary where German-facing
  security-service language expects "Objekt"

### Entity Relationships

`organizational units` are internal-only hierarchy nodes. Each unit belongs to one tenant and may have
one parent organizational unit in the same tenant. Root units have no parent. Children are also
organizational units; customers and sites are never children in this hierarchy.

`customers` / `companies` are external organizations. They belong to one tenant and are flat in this
first model: customers do not have parent customers, child companies, or positions inside the internal
organizational unit tree.

`objects` / `sites` are target objects. Each site belongs to exactly one customer and is assigned to
exactly one responsible organizational unit. This creates two explicit references:

- `sites.customer_id` identifies the external customer that owns or contracts the object.
- `sites.organizational_unit_id` identifies the internal unit responsible for managing the object.

The responsible organizational unit does not make the site part of the organizational unit hierarchy.
It is a management responsibility link only.

### User Assignment Rules

Users may be directly assigned only to these entity types in the organization context:

- `organizational_units`, for internal scope and delegated administration
- `customers`, for customer-level responsibility or visibility
- `sites`, for direct object-level responsibility or visibility

The following inheritance rules are explicit:

- An assignment to an `organizational_unit` may include descendant organizational units only when the
  assignment record explicitly enables descendant scope.
- An assignment to an `organizational_unit` does not automatically assign the user to customers managed
  by that unit.
- An assignment to an `organizational_unit` does not automatically assign the user to sites managed by
  that unit.
- An assignment to a `customer` does not automatically assign the user to that customer's sites.
- An assignment to a `site` does not imply assignment to the owning customer.
- Customers and sites do not inherit membership, administration, or publication rights from parent
  organizational units through the organizational hierarchy.

Any later query may combine direct assignments and explicit scope expansion for access checks, but the
domain model must not rely on implicit customer or site membership through organizational hierarchy.

### Keys, Parent-Child Rules, and Deletion Rules

All GuardGuide organization-context domain tables use UUID primary keys. They also carry a tenant
reference so standalone data remains isolated and future SecPal integration can map tenant-bounded
records cleanly.

`organizational_units` use:

- primary key: `id` as UUID
- tenant key: `tenant_id`
- parent-child key: nullable `parent_id` referencing `organizational_units.id` in the same tenant
- deletion rule: soft delete by default; deleting a unit with active child units, active user
  assignments, or active site responsibility is rejected unless a later migration defines an explicit
  reassignment or subtree deletion workflow

`customers` use:

- primary key: `id` as UUID
- tenant key: `tenant_id`
- parent-child key: none in this first model
- deletion rule: soft delete by default; deleting a customer with active sites is rejected unless a
  later workflow first archives or reassigns those sites

`sites` use:

- primary key: `id` as UUID
- tenant key: `tenant_id`
- parent-child keys: required `customer_id` referencing `customers.id` and required
  `organizational_unit_id` referencing `organizational_units.id`
- deletion rule: soft delete by default; deleting a site preserves historical acknowledgement and
  instruction context, while new assignments or publications to the deleted site are blocked

Assignment tables use UUID primary keys and required references to the assigned user plus the assigned
entity. Assignment rows are historical records; ending access should normally set validity dates or
create an audit-visible revocation instead of deleting the row.

### Scope Boundary

This decision defines the organization context model only. It intentionally does not model:

- service instructions, instruction templates, versions, publication states, or acknowledgements
- which instruction types are mandatory for a site or customer
- QR entry, magic-link confirmation, supervised fallback acknowledgement, or audit evidence
- SecPal synchronization jobs, conflict resolution, or field-level ownership once integration is
  enabled

Later service-instruction decisions and migrations must reference these organization-context entities
instead of redefining organization, customer, company, object, or site terminology.

## Consequences

- GuardGuide keeps internal organization, external customers, and target objects separate from the
  first domain modeling slice.
- Future migrations can use stable table names without waiting for full instruction modeling.
- Authorization and publication work must model customer and site access explicitly instead of
  assuming it falls out of the organizational unit tree.
- SecPal integration can map to existing `organizational_units`, `customers`, and `sites` concepts
  without treating external customers as internal departments.

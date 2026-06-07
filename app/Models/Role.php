<?php

namespace App\Models;

use Spatie\Permission\Models\Role as SpatieRole;

/**
 * GuardGuide-specific role model that extends the Spatie baseline with the
 * `label` column added by the 2026_06_07 migration. Spatie's static `create`
 * is annotated to return `RoleContract|Role`; the @method override below
 * narrows the return back to the concrete subclass so PHPStan/Larastan can
 * track the actual model through controller and seeder flows.
 *
 * @property string|null $label
 *
 * @method static static create(array $attributes = [])
 */
class Role extends SpatieRole
{
    //
}

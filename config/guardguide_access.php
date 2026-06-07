<?php

use App\Auth\Sources\LocalGuardGuideRolePermissionSource;

return [
    /*
    |--------------------------------------------------------------------------
    | GuardGuide Role And Permission Source
    |--------------------------------------------------------------------------
    |
    | GuardGuide runs standalone by default and synchronizes Spatie RBAC records
    | from the local first-party catalog. A later SecPal-backed source can be
    | registered in "sources" and selected here without changing policies or
    | local authorization checks.
    |
    */

    'source' => env('GUARDGUIDE_ACCESS_SOURCE', 'local'),

    'sources' => [
        'local' => LocalGuardGuideRolePermissionSource::class,
    ],
];

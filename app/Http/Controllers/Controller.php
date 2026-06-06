<?php

namespace App\Http\Controllers;

use App\Enums\OrganizationalUnitType;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

abstract class Controller
{
    use AuthorizesRequests;

    protected function organizationalUnitTypeLabel(OrganizationalUnitType|string $type): string
    {
        if ($type instanceof OrganizationalUnitType) {
            return $type->label();
        }

        return $type;
    }
}

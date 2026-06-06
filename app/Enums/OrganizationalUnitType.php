<?php

namespace App\Enums;

enum OrganizationalUnitType: string
{
    case Company = 'company';
    case Division = 'division';
    case Department = 'department';
    case Team = 'team';

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

<?php

use App\Enums\OrganizationalUnitType;

test('organizational unit type values are stable for persistence', function () {
    expect(OrganizationalUnitType::values())->toBe([
        'company',
        'division',
        'department',
        'team',
    ]);
});

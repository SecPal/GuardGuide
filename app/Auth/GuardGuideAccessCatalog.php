<?php

namespace App\Auth;

/**
 * GuardGuide-specific role and permission catalog for standalone RBAC.
 */
final class GuardGuideAccessCatalog
{
    public const string GUARD = 'web';

    public const string ROLE_PLATFORM_ADMINISTRATOR = 'platform-administrator';

    public const string ROLE_CUSTOMER_MANAGER = 'customer-manager';

    public const string ROLE_SITE_MANAGER = 'site-manager';

    public const string ROLE_OPERATIONS_USER = 'operations-user';

    public const string ORGANIZATIONAL_UNITS_VIEW = 'organizational_units.view';

    public const string ORGANIZATIONAL_UNITS_CREATE = 'organizational_units.create';

    public const string ORGANIZATIONAL_UNITS_UPDATE = 'organizational_units.update';

    public const string ORGANIZATIONAL_UNITS_DELETE = 'organizational_units.delete';

    public const string CUSTOMERS_VIEW = 'customers.view';

    public const string CUSTOMERS_CREATE = 'customers.create';

    public const string CUSTOMERS_UPDATE = 'customers.update';

    public const string CUSTOMERS_DELETE = 'customers.delete';

    public const string SITES_VIEW = 'sites.view';

    public const string SITES_CREATE = 'sites.create';

    public const string SITES_UPDATE = 'sites.update';

    public const string SITES_DELETE = 'sites.delete';

    public const string USER_ASSIGNMENTS_VIEW = 'user_assignments.view';

    public const string USER_ASSIGNMENTS_MANAGE = 'user_assignments.manage';

    public const string WORKFLOWS_VIEW = 'workflows.view';

    public const string WORKFLOWS_MANAGE = 'workflows.manage';

    public const string WORKFLOWS_EXECUTE = 'workflows.execute';

    /**
     * @return array<string, string>
     */
    public static function permissions(): array
    {
        return [
            self::ORGANIZATIONAL_UNITS_VIEW => 'Organizational structure can be viewed.',
            self::ORGANIZATIONAL_UNITS_CREATE => 'Organizational units can be created.',
            self::ORGANIZATIONAL_UNITS_UPDATE => 'Organizational units can be edited and moved.',
            self::ORGANIZATIONAL_UNITS_DELETE => 'Organizational units can be removed.',
            self::CUSTOMERS_VIEW => 'Customers and companies can be viewed.',
            self::CUSTOMERS_CREATE => 'Customers and companies can be created.',
            self::CUSTOMERS_UPDATE => 'Customers and companies can be edited.',
            self::CUSTOMERS_DELETE => 'Customers and companies can be removed.',
            self::SITES_VIEW => 'Sites and guarded objects can be viewed.',
            self::SITES_CREATE => 'Sites and guarded objects can be created.',
            self::SITES_UPDATE => 'Sites and guarded objects can be edited.',
            self::SITES_DELETE => 'Sites and guarded objects can be removed.',
            self::USER_ASSIGNMENTS_VIEW => 'User assignments can be viewed.',
            self::USER_ASSIGNMENTS_MANAGE => 'User assignments can be changed.',
            self::WORKFLOWS_VIEW => 'Future workflow runs can be viewed.',
            self::WORKFLOWS_MANAGE => 'Future workflow definitions can be managed.',
            self::WORKFLOWS_EXECUTE => 'Future workflow tasks can be executed.',
        ];
    }

    /**
     * @return array<string, array{name: string, permissions: list<string>}>
     */
    public static function roles(): array
    {
        $allPermissions = array_keys(self::permissions());

        return [
            self::ROLE_PLATFORM_ADMINISTRATOR => [
                'name' => 'Platform administration',
                'permissions' => $allPermissions,
            ],
            self::ROLE_CUSTOMER_MANAGER => [
                'name' => 'Customer management',
                'permissions' => [
                    self::ORGANIZATIONAL_UNITS_VIEW,
                    self::CUSTOMERS_VIEW,
                    self::CUSTOMERS_CREATE,
                    self::CUSTOMERS_UPDATE,
                    self::CUSTOMERS_DELETE,
                    self::SITES_VIEW,
                    self::USER_ASSIGNMENTS_VIEW,
                ],
            ],
            self::ROLE_SITE_MANAGER => [
                'name' => 'Site management',
                'permissions' => [
                    self::ORGANIZATIONAL_UNITS_VIEW,
                    self::CUSTOMERS_VIEW,
                    self::SITES_VIEW,
                    self::SITES_CREATE,
                    self::SITES_UPDATE,
                    self::SITES_DELETE,
                    self::USER_ASSIGNMENTS_VIEW,
                ],
            ],
            self::ROLE_OPERATIONS_USER => [
                'name' => 'Operational usage',
                'permissions' => [
                    self::CUSTOMERS_VIEW,
                    self::SITES_VIEW,
                    self::WORKFLOWS_VIEW,
                    self::WORKFLOWS_EXECUTE,
                ],
            ],
        ];
    }
}

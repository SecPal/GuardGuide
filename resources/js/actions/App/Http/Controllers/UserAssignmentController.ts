import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\UserAssignmentController::redirectToFirstUser
* @see app/Http/Controllers/UserAssignmentController.php:22
* @route '/user-assignments'
*/
export const redirectToFirstUser = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirectToFirstUser.url(options),
    method: 'get',
})

redirectToFirstUser.definition = {
    methods: ["get","head"],
    url: '/user-assignments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserAssignmentController::redirectToFirstUser
* @see app/Http/Controllers/UserAssignmentController.php:22
* @route '/user-assignments'
*/
redirectToFirstUser.url = (options?: RouteQueryOptions) => {
    return redirectToFirstUser.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserAssignmentController::redirectToFirstUser
* @see app/Http/Controllers/UserAssignmentController.php:22
* @route '/user-assignments'
*/
redirectToFirstUser.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirectToFirstUser.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::redirectToFirstUser
* @see app/Http/Controllers/UserAssignmentController.php:22
* @route '/user-assignments'
*/
redirectToFirstUser.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirectToFirstUser.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::redirectToFirstUser
* @see app/Http/Controllers/UserAssignmentController.php:22
* @route '/user-assignments'
*/
const redirectToFirstUserForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirectToFirstUser.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::redirectToFirstUser
* @see app/Http/Controllers/UserAssignmentController.php:22
* @route '/user-assignments'
*/
redirectToFirstUserForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirectToFirstUser.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::redirectToFirstUser
* @see app/Http/Controllers/UserAssignmentController.php:22
* @route '/user-assignments'
*/
redirectToFirstUserForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirectToFirstUser.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

redirectToFirstUser.form = redirectToFirstUserForm

/**
* @see \App\Http\Controllers\UserAssignmentController::index
* @see app/Http/Controllers/UserAssignmentController.php:35
* @route '/users/{user}/assignments'
*/
export const index = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/users/{user}/assignments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserAssignmentController::index
* @see app/Http/Controllers/UserAssignmentController.php:35
* @route '/users/{user}/assignments'
*/
index.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return index.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserAssignmentController::index
* @see app/Http/Controllers/UserAssignmentController.php:35
* @route '/users/{user}/assignments'
*/
index.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::index
* @see app/Http/Controllers/UserAssignmentController.php:35
* @route '/users/{user}/assignments'
*/
index.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::index
* @see app/Http/Controllers/UserAssignmentController.php:35
* @route '/users/{user}/assignments'
*/
const indexForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::index
* @see app/Http/Controllers/UserAssignmentController.php:35
* @route '/users/{user}/assignments'
*/
indexForm.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::index
* @see app/Http/Controllers/UserAssignmentController.php:35
* @route '/users/{user}/assignments'
*/
indexForm.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\UserAssignmentController::storeOrganizationalUnit
* @see app/Http/Controllers/UserAssignmentController.php:112
* @route '/users/{user}/assignments/organizational-units'
*/
export const storeOrganizationalUnit = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeOrganizationalUnit.url(args, options),
    method: 'post',
})

storeOrganizationalUnit.definition = {
    methods: ["post"],
    url: '/users/{user}/assignments/organizational-units',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserAssignmentController::storeOrganizationalUnit
* @see app/Http/Controllers/UserAssignmentController.php:112
* @route '/users/{user}/assignments/organizational-units'
*/
storeOrganizationalUnit.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return storeOrganizationalUnit.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserAssignmentController::storeOrganizationalUnit
* @see app/Http/Controllers/UserAssignmentController.php:112
* @route '/users/{user}/assignments/organizational-units'
*/
storeOrganizationalUnit.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeOrganizationalUnit.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::storeOrganizationalUnit
* @see app/Http/Controllers/UserAssignmentController.php:112
* @route '/users/{user}/assignments/organizational-units'
*/
const storeOrganizationalUnitForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeOrganizationalUnit.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::storeOrganizationalUnit
* @see app/Http/Controllers/UserAssignmentController.php:112
* @route '/users/{user}/assignments/organizational-units'
*/
storeOrganizationalUnitForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeOrganizationalUnit.url(args, options),
    method: 'post',
})

storeOrganizationalUnit.form = storeOrganizationalUnitForm

/**
* @see \App\Http\Controllers\UserAssignmentController::destroyOrganizationalUnit
* @see app/Http/Controllers/UserAssignmentController.php:128
* @route '/users/{user}/assignments/organizational-units/{organizationalUnit}'
*/
export const destroyOrganizationalUnit = (args: { user: number | { id: number }, organizationalUnit: string | { id: string } } | [user: number | { id: number }, organizationalUnit: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyOrganizationalUnit.url(args, options),
    method: 'delete',
})

destroyOrganizationalUnit.definition = {
    methods: ["delete"],
    url: '/users/{user}/assignments/organizational-units/{organizationalUnit}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\UserAssignmentController::destroyOrganizationalUnit
* @see app/Http/Controllers/UserAssignmentController.php:128
* @route '/users/{user}/assignments/organizational-units/{organizationalUnit}'
*/
destroyOrganizationalUnit.url = (args: { user: number | { id: number }, organizationalUnit: string | { id: string } } | [user: number | { id: number }, organizationalUnit: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            user: args[0],
            organizationalUnit: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
        organizationalUnit: typeof args.organizationalUnit === 'object'
        ? args.organizationalUnit.id
        : args.organizationalUnit,
    }

    return destroyOrganizationalUnit.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace('{organizationalUnit}', parsedArgs.organizationalUnit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserAssignmentController::destroyOrganizationalUnit
* @see app/Http/Controllers/UserAssignmentController.php:128
* @route '/users/{user}/assignments/organizational-units/{organizationalUnit}'
*/
destroyOrganizationalUnit.delete = (args: { user: number | { id: number }, organizationalUnit: string | { id: string } } | [user: number | { id: number }, organizationalUnit: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyOrganizationalUnit.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::destroyOrganizationalUnit
* @see app/Http/Controllers/UserAssignmentController.php:128
* @route '/users/{user}/assignments/organizational-units/{organizationalUnit}'
*/
const destroyOrganizationalUnitForm = (args: { user: number | { id: number }, organizationalUnit: string | { id: string } } | [user: number | { id: number }, organizationalUnit: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyOrganizationalUnit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::destroyOrganizationalUnit
* @see app/Http/Controllers/UserAssignmentController.php:128
* @route '/users/{user}/assignments/organizational-units/{organizationalUnit}'
*/
destroyOrganizationalUnitForm.delete = (args: { user: number | { id: number }, organizationalUnit: string | { id: string } } | [user: number | { id: number }, organizationalUnit: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyOrganizationalUnit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyOrganizationalUnit.form = destroyOrganizationalUnitForm

/**
* @see \App\Http\Controllers\UserAssignmentController::storeCustomer
* @see app/Http/Controllers/UserAssignmentController.php:142
* @route '/users/{user}/assignments/customers'
*/
export const storeCustomer = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCustomer.url(args, options),
    method: 'post',
})

storeCustomer.definition = {
    methods: ["post"],
    url: '/users/{user}/assignments/customers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserAssignmentController::storeCustomer
* @see app/Http/Controllers/UserAssignmentController.php:142
* @route '/users/{user}/assignments/customers'
*/
storeCustomer.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return storeCustomer.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserAssignmentController::storeCustomer
* @see app/Http/Controllers/UserAssignmentController.php:142
* @route '/users/{user}/assignments/customers'
*/
storeCustomer.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeCustomer.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::storeCustomer
* @see app/Http/Controllers/UserAssignmentController.php:142
* @route '/users/{user}/assignments/customers'
*/
const storeCustomerForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeCustomer.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::storeCustomer
* @see app/Http/Controllers/UserAssignmentController.php:142
* @route '/users/{user}/assignments/customers'
*/
storeCustomerForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeCustomer.url(args, options),
    method: 'post',
})

storeCustomer.form = storeCustomerForm

/**
* @see \App\Http\Controllers\UserAssignmentController::destroyCustomer
* @see app/Http/Controllers/UserAssignmentController.php:158
* @route '/users/{user}/assignments/customers/{customer}'
*/
export const destroyCustomer = (args: { user: number | { id: number }, customer: string | { id: string } } | [user: number | { id: number }, customer: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyCustomer.url(args, options),
    method: 'delete',
})

destroyCustomer.definition = {
    methods: ["delete"],
    url: '/users/{user}/assignments/customers/{customer}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\UserAssignmentController::destroyCustomer
* @see app/Http/Controllers/UserAssignmentController.php:158
* @route '/users/{user}/assignments/customers/{customer}'
*/
destroyCustomer.url = (args: { user: number | { id: number }, customer: string | { id: string } } | [user: number | { id: number }, customer: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            user: args[0],
            customer: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
        customer: typeof args.customer === 'object'
        ? args.customer.id
        : args.customer,
    }

    return destroyCustomer.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserAssignmentController::destroyCustomer
* @see app/Http/Controllers/UserAssignmentController.php:158
* @route '/users/{user}/assignments/customers/{customer}'
*/
destroyCustomer.delete = (args: { user: number | { id: number }, customer: string | { id: string } } | [user: number | { id: number }, customer: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyCustomer.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::destroyCustomer
* @see app/Http/Controllers/UserAssignmentController.php:158
* @route '/users/{user}/assignments/customers/{customer}'
*/
const destroyCustomerForm = (args: { user: number | { id: number }, customer: string | { id: string } } | [user: number | { id: number }, customer: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyCustomer.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::destroyCustomer
* @see app/Http/Controllers/UserAssignmentController.php:158
* @route '/users/{user}/assignments/customers/{customer}'
*/
destroyCustomerForm.delete = (args: { user: number | { id: number }, customer: string | { id: string } } | [user: number | { id: number }, customer: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyCustomer.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyCustomer.form = destroyCustomerForm

/**
* @see \App\Http\Controllers\UserAssignmentController::storeSite
* @see app/Http/Controllers/UserAssignmentController.php:179
* @route '/users/{user}/assignments/sites'
*/
export const storeSite = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeSite.url(args, options),
    method: 'post',
})

storeSite.definition = {
    methods: ["post"],
    url: '/users/{user}/assignments/sites',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserAssignmentController::storeSite
* @see app/Http/Controllers/UserAssignmentController.php:179
* @route '/users/{user}/assignments/sites'
*/
storeSite.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return storeSite.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserAssignmentController::storeSite
* @see app/Http/Controllers/UserAssignmentController.php:179
* @route '/users/{user}/assignments/sites'
*/
storeSite.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeSite.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::storeSite
* @see app/Http/Controllers/UserAssignmentController.php:179
* @route '/users/{user}/assignments/sites'
*/
const storeSiteForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeSite.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::storeSite
* @see app/Http/Controllers/UserAssignmentController.php:179
* @route '/users/{user}/assignments/sites'
*/
storeSiteForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeSite.url(args, options),
    method: 'post',
})

storeSite.form = storeSiteForm

/**
* @see \App\Http\Controllers\UserAssignmentController::destroySite
* @see app/Http/Controllers/UserAssignmentController.php:208
* @route '/users/{user}/assignments/sites/{site}'
*/
export const destroySite = (args: { user: number | { id: number }, site: string | { id: string } } | [user: number | { id: number }, site: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroySite.url(args, options),
    method: 'delete',
})

destroySite.definition = {
    methods: ["delete"],
    url: '/users/{user}/assignments/sites/{site}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\UserAssignmentController::destroySite
* @see app/Http/Controllers/UserAssignmentController.php:208
* @route '/users/{user}/assignments/sites/{site}'
*/
destroySite.url = (args: { user: number | { id: number }, site: string | { id: string } } | [user: number | { id: number }, site: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            user: args[0],
            site: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
        site: typeof args.site === 'object'
        ? args.site.id
        : args.site,
    }

    return destroySite.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserAssignmentController::destroySite
* @see app/Http/Controllers/UserAssignmentController.php:208
* @route '/users/{user}/assignments/sites/{site}'
*/
destroySite.delete = (args: { user: number | { id: number }, site: string | { id: string } } | [user: number | { id: number }, site: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroySite.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::destroySite
* @see app/Http/Controllers/UserAssignmentController.php:208
* @route '/users/{user}/assignments/sites/{site}'
*/
const destroySiteForm = (args: { user: number | { id: number }, site: string | { id: string } } | [user: number | { id: number }, site: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroySite.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::destroySite
* @see app/Http/Controllers/UserAssignmentController.php:208
* @route '/users/{user}/assignments/sites/{site}'
*/
destroySiteForm.delete = (args: { user: number | { id: number }, site: string | { id: string } } | [user: number | { id: number }, site: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroySite.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroySite.form = destroySiteForm

const UserAssignmentController = { redirectToFirstUser, index, storeOrganizationalUnit, destroyOrganizationalUnit, storeCustomer, destroyCustomer, storeSite, destroySite }

export default UserAssignmentController
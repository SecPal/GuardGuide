import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\UserRoleController::redirectToFirstUser
* @see app/Http/Controllers/UserRoleController.php:17
* @route '/user-roles'
*/
export const redirectToFirstUser = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirectToFirstUser.url(options),
    method: 'get',
})

redirectToFirstUser.definition = {
    methods: ["get","head"],
    url: '/user-roles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserRoleController::redirectToFirstUser
* @see app/Http/Controllers/UserRoleController.php:17
* @route '/user-roles'
*/
redirectToFirstUser.url = (options?: RouteQueryOptions) => {
    return redirectToFirstUser.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserRoleController::redirectToFirstUser
* @see app/Http/Controllers/UserRoleController.php:17
* @route '/user-roles'
*/
redirectToFirstUser.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirectToFirstUser.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserRoleController::redirectToFirstUser
* @see app/Http/Controllers/UserRoleController.php:17
* @route '/user-roles'
*/
redirectToFirstUser.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirectToFirstUser.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserRoleController::redirectToFirstUser
* @see app/Http/Controllers/UserRoleController.php:17
* @route '/user-roles'
*/
const redirectToFirstUserForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirectToFirstUser.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserRoleController::redirectToFirstUser
* @see app/Http/Controllers/UserRoleController.php:17
* @route '/user-roles'
*/
redirectToFirstUserForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirectToFirstUser.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserRoleController::redirectToFirstUser
* @see app/Http/Controllers/UserRoleController.php:17
* @route '/user-roles'
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
* @see \App\Http\Controllers\UserRoleController::index
* @see app/Http/Controllers/UserRoleController.php:30
* @route '/users/{user}/roles'
*/
export const index = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/users/{user}/roles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserRoleController::index
* @see app/Http/Controllers/UserRoleController.php:30
* @route '/users/{user}/roles'
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
* @see \App\Http\Controllers\UserRoleController::index
* @see app/Http/Controllers/UserRoleController.php:30
* @route '/users/{user}/roles'
*/
index.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserRoleController::index
* @see app/Http/Controllers/UserRoleController.php:30
* @route '/users/{user}/roles'
*/
index.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserRoleController::index
* @see app/Http/Controllers/UserRoleController.php:30
* @route '/users/{user}/roles'
*/
const indexForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserRoleController::index
* @see app/Http/Controllers/UserRoleController.php:30
* @route '/users/{user}/roles'
*/
indexForm.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserRoleController::index
* @see app/Http/Controllers/UserRoleController.php:30
* @route '/users/{user}/roles'
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
* @see \App\Http\Controllers\UserRoleController::store
* @see app/Http/Controllers/UserRoleController.php:75
* @route '/users/{user}/roles'
*/
export const store = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/users/{user}/roles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserRoleController::store
* @see app/Http/Controllers/UserRoleController.php:75
* @route '/users/{user}/roles'
*/
store.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserRoleController::store
* @see app/Http/Controllers/UserRoleController.php:75
* @route '/users/{user}/roles'
*/
store.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserRoleController::store
* @see app/Http/Controllers/UserRoleController.php:75
* @route '/users/{user}/roles'
*/
const storeForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserRoleController::store
* @see app/Http/Controllers/UserRoleController.php:75
* @route '/users/{user}/roles'
*/
storeForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\UserRoleController::destroy
* @see app/Http/Controllers/UserRoleController.php:98
* @route '/users/{user}/roles/{role}'
*/
export const destroy = (args: { user: number | { id: number }, role: string | number | { id: string | number } } | [user: number | { id: number }, role: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/users/{user}/roles/{role}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\UserRoleController::destroy
* @see app/Http/Controllers/UserRoleController.php:98
* @route '/users/{user}/roles/{role}'
*/
destroy.url = (args: { user: number | { id: number }, role: string | number | { id: string | number } } | [user: number | { id: number }, role: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            user: args[0],
            role: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
        role: typeof args.role === 'object'
        ? args.role.id
        : args.role,
    }

    return destroy.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserRoleController::destroy
* @see app/Http/Controllers/UserRoleController.php:98
* @route '/users/{user}/roles/{role}'
*/
destroy.delete = (args: { user: number | { id: number }, role: string | number | { id: string | number } } | [user: number | { id: number }, role: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\UserRoleController::destroy
* @see app/Http/Controllers/UserRoleController.php:98
* @route '/users/{user}/roles/{role}'
*/
const destroyForm = (args: { user: number | { id: number }, role: string | number | { id: string | number } } | [user: number | { id: number }, role: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserRoleController::destroy
* @see app/Http/Controllers/UserRoleController.php:98
* @route '/users/{user}/roles/{role}'
*/
destroyForm.delete = (args: { user: number | { id: number }, role: string | number | { id: string | number } } | [user: number | { id: number }, role: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const UserRoleController = { redirectToFirstUser, index, store, destroy }

export default UserRoleController
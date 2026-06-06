import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\UserAssignmentController::store
* @see app/Http/Controllers/UserAssignmentController.php:181
* @route '/users/{user}/assignments/sites'
*/
export const store = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/users/{user}/assignments/sites',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserAssignmentController::store
* @see app/Http/Controllers/UserAssignmentController.php:181
* @route '/users/{user}/assignments/sites'
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
* @see \App\Http\Controllers\UserAssignmentController::store
* @see app/Http/Controllers/UserAssignmentController.php:181
* @route '/users/{user}/assignments/sites'
*/
store.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::store
* @see app/Http/Controllers/UserAssignmentController.php:181
* @route '/users/{user}/assignments/sites'
*/
const storeForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::store
* @see app/Http/Controllers/UserAssignmentController.php:181
* @route '/users/{user}/assignments/sites'
*/
storeForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\UserAssignmentController::destroy
* @see app/Http/Controllers/UserAssignmentController.php:216
* @route '/users/{user}/assignments/sites/{site}'
*/
export const destroy = (args: { user: number | { id: number }, site: string | number | { id: string | number } } | [user: number | { id: number }, site: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/users/{user}/assignments/sites/{site}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\UserAssignmentController::destroy
* @see app/Http/Controllers/UserAssignmentController.php:216
* @route '/users/{user}/assignments/sites/{site}'
*/
destroy.url = (args: { user: number | { id: number }, site: string | number | { id: string | number } } | [user: number | { id: number }, site: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace('{site}', parsedArgs.site.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserAssignmentController::destroy
* @see app/Http/Controllers/UserAssignmentController.php:216
* @route '/users/{user}/assignments/sites/{site}'
*/
destroy.delete = (args: { user: number | { id: number }, site: string | number | { id: string | number } } | [user: number | { id: number }, site: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::destroy
* @see app/Http/Controllers/UserAssignmentController.php:216
* @route '/users/{user}/assignments/sites/{site}'
*/
const destroyForm = (args: { user: number | { id: number }, site: string | number | { id: string | number } } | [user: number | { id: number }, site: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::destroy
* @see app/Http/Controllers/UserAssignmentController.php:216
* @route '/users/{user}/assignments/sites/{site}'
*/
destroyForm.delete = (args: { user: number | { id: number }, site: string | number | { id: string | number } } | [user: number | { id: number }, site: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const sites = {
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
}

export default sites
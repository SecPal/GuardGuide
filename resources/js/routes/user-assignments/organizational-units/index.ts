import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\UserAssignmentController::store
* @see app/Http/Controllers/UserAssignmentController.php:125
* @route '/users/{user}/assignments/organizational-units'
*/
export const store = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/users/{user}/assignments/organizational-units',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserAssignmentController::store
* @see app/Http/Controllers/UserAssignmentController.php:125
* @route '/users/{user}/assignments/organizational-units'
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
* @see app/Http/Controllers/UserAssignmentController.php:125
* @route '/users/{user}/assignments/organizational-units'
*/
store.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::store
* @see app/Http/Controllers/UserAssignmentController.php:125
* @route '/users/{user}/assignments/organizational-units'
*/
const storeForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::store
* @see app/Http/Controllers/UserAssignmentController.php:125
* @route '/users/{user}/assignments/organizational-units'
*/
storeForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\UserAssignmentController::destroy
* @see app/Http/Controllers/UserAssignmentController.php:141
* @route '/users/{user}/assignments/organizational-units/{organizationalUnit}'
*/
export const destroy = (args: { user: number | { id: number }, organizationalUnit: string | { id: string } } | [user: number | { id: number }, organizationalUnit: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/users/{user}/assignments/organizational-units/{organizationalUnit}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\UserAssignmentController::destroy
* @see app/Http/Controllers/UserAssignmentController.php:141
* @route '/users/{user}/assignments/organizational-units/{organizationalUnit}'
*/
destroy.url = (args: { user: number | { id: number }, organizationalUnit: string | { id: string } } | [user: number | { id: number }, organizationalUnit: string | { id: string } ], options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace('{organizationalUnit}', parsedArgs.organizationalUnit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserAssignmentController::destroy
* @see app/Http/Controllers/UserAssignmentController.php:141
* @route '/users/{user}/assignments/organizational-units/{organizationalUnit}'
*/
destroy.delete = (args: { user: number | { id: number }, organizationalUnit: string | { id: string } } | [user: number | { id: number }, organizationalUnit: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::destroy
* @see app/Http/Controllers/UserAssignmentController.php:141
* @route '/users/{user}/assignments/organizational-units/{organizationalUnit}'
*/
const destroyForm = (args: { user: number | { id: number }, organizationalUnit: string | { id: string } } | [user: number | { id: number }, organizationalUnit: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/UserAssignmentController.php:141
* @route '/users/{user}/assignments/organizational-units/{organizationalUnit}'
*/
destroyForm.delete = (args: { user: number | { id: number }, organizationalUnit: string | { id: string } } | [user: number | { id: number }, organizationalUnit: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const organizationalUnits = {
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
}

export default organizationalUnits
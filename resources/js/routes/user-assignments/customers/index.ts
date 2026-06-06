import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\UserAssignmentController::store
* @see app/Http/Controllers/UserAssignmentController.php:142
* @route '/users/{user}/assignments/customers'
*/
export const store = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/users/{user}/assignments/customers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserAssignmentController::store
* @see app/Http/Controllers/UserAssignmentController.php:142
* @route '/users/{user}/assignments/customers'
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
* @see app/Http/Controllers/UserAssignmentController.php:142
* @route '/users/{user}/assignments/customers'
*/
store.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::store
* @see app/Http/Controllers/UserAssignmentController.php:142
* @route '/users/{user}/assignments/customers'
*/
const storeForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::store
* @see app/Http/Controllers/UserAssignmentController.php:142
* @route '/users/{user}/assignments/customers'
*/
storeForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\UserAssignmentController::destroy
* @see app/Http/Controllers/UserAssignmentController.php:164
* @route '/users/{user}/assignments/customers/{customer}'
*/
export const destroy = (args: { user: number | { id: number }, customer: string | number | { id: string | number } } | [user: number | { id: number }, customer: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/users/{user}/assignments/customers/{customer}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\UserAssignmentController::destroy
* @see app/Http/Controllers/UserAssignmentController.php:164
* @route '/users/{user}/assignments/customers/{customer}'
*/
destroy.url = (args: { user: number | { id: number }, customer: string | number | { id: string | number } } | [user: number | { id: number }, customer: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserAssignmentController::destroy
* @see app/Http/Controllers/UserAssignmentController.php:164
* @route '/users/{user}/assignments/customers/{customer}'
*/
destroy.delete = (args: { user: number | { id: number }, customer: string | number | { id: string | number } } | [user: number | { id: number }, customer: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::destroy
* @see app/Http/Controllers/UserAssignmentController.php:164
* @route '/users/{user}/assignments/customers/{customer}'
*/
const destroyForm = (args: { user: number | { id: number }, customer: string | number | { id: string | number } } | [user: number | { id: number }, customer: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see app/Http/Controllers/UserAssignmentController.php:164
* @route '/users/{user}/assignments/customers/{customer}'
*/
destroyForm.delete = (args: { user: number | { id: number }, customer: string | number | { id: string | number } } | [user: number | { id: number }, customer: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const customers = {
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
}

export default customers
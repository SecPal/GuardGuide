import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import organizationalUnits from './organizational-units'
import customers from './customers'
import sites from './sites'
/**
* @see \App\Http\Controllers\UserAssignmentController::redirect
* @see app/Http/Controllers/UserAssignmentController.php:22
* @route '/user-assignments'
*/
export const redirect = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(options),
    method: 'get',
})

redirect.definition = {
    methods: ["get","head"],
    url: '/user-assignments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserAssignmentController::redirect
* @see app/Http/Controllers/UserAssignmentController.php:22
* @route '/user-assignments'
*/
redirect.url = (options?: RouteQueryOptions) => {
    return redirect.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserAssignmentController::redirect
* @see app/Http/Controllers/UserAssignmentController.php:22
* @route '/user-assignments'
*/
redirect.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirect.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::redirect
* @see app/Http/Controllers/UserAssignmentController.php:22
* @route '/user-assignments'
*/
redirect.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirect.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::redirect
* @see app/Http/Controllers/UserAssignmentController.php:22
* @route '/user-assignments'
*/
const redirectForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirect.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::redirect
* @see app/Http/Controllers/UserAssignmentController.php:22
* @route '/user-assignments'
*/
redirectForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirect.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserAssignmentController::redirect
* @see app/Http/Controllers/UserAssignmentController.php:22
* @route '/user-assignments'
*/
redirectForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: redirect.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

redirect.form = redirectForm

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

const userAssignments = {
    redirect: Object.assign(redirect, redirect),
    index: Object.assign(index, index),
    organizationalUnits: Object.assign(organizationalUnits, organizationalUnits),
    customers: Object.assign(customers, customers),
    sites: Object.assign(sites, sites),
}

export default userAssignments
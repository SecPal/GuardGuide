import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\OrganizationalUnitController::index
* @see app/Http/Controllers/OrganizationalUnitController.php:17
* @route '/organizational-units'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/organizational-units',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationalUnitController::index
* @see app/Http/Controllers/OrganizationalUnitController.php:17
* @route '/organizational-units'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationalUnitController::index
* @see app/Http/Controllers/OrganizationalUnitController.php:17
* @route '/organizational-units'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrganizationalUnitController::index
* @see app/Http/Controllers/OrganizationalUnitController.php:17
* @route '/organizational-units'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrganizationalUnitController::index
* @see app/Http/Controllers/OrganizationalUnitController.php:17
* @route '/organizational-units'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrganizationalUnitController::index
* @see app/Http/Controllers/OrganizationalUnitController.php:17
* @route '/organizational-units'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrganizationalUnitController::index
* @see app/Http/Controllers/OrganizationalUnitController.php:17
* @route '/organizational-units'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\OrganizationalUnitController::store
* @see app/Http/Controllers/OrganizationalUnitController.php:43
* @route '/organizational-units'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/organizational-units',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationalUnitController::store
* @see app/Http/Controllers/OrganizationalUnitController.php:43
* @route '/organizational-units'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationalUnitController::store
* @see app/Http/Controllers/OrganizationalUnitController.php:43
* @route '/organizational-units'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrganizationalUnitController::store
* @see app/Http/Controllers/OrganizationalUnitController.php:43
* @route '/organizational-units'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrganizationalUnitController::store
* @see app/Http/Controllers/OrganizationalUnitController.php:43
* @route '/organizational-units'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\OrganizationalUnitController::update
* @see app/Http/Controllers/OrganizationalUnitController.php:60
* @route '/organizational-units/{organizationalUnit}'
*/
export const update = (args: { organizationalUnit: string | { id: string } } | [organizationalUnit: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/organizational-units/{organizationalUnit}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\OrganizationalUnitController::update
* @see app/Http/Controllers/OrganizationalUnitController.php:60
* @route '/organizational-units/{organizationalUnit}'
*/
update.url = (args: { organizationalUnit: string | { id: string } } | [organizationalUnit: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organizationalUnit: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { organizationalUnit: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            organizationalUnit: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        organizationalUnit: typeof args.organizationalUnit === 'object'
        ? args.organizationalUnit.id
        : args.organizationalUnit,
    }

    return update.definition.url
            .replace('{organizationalUnit}', parsedArgs.organizationalUnit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationalUnitController::update
* @see app/Http/Controllers/OrganizationalUnitController.php:60
* @route '/organizational-units/{organizationalUnit}'
*/
update.put = (args: { organizationalUnit: string | { id: string } } | [organizationalUnit: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\OrganizationalUnitController::update
* @see app/Http/Controllers/OrganizationalUnitController.php:60
* @route '/organizational-units/{organizationalUnit}'
*/
const updateForm = (args: { organizationalUnit: string | { id: string } } | [organizationalUnit: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrganizationalUnitController::update
* @see app/Http/Controllers/OrganizationalUnitController.php:60
* @route '/organizational-units/{organizationalUnit}'
*/
updateForm.put = (args: { organizationalUnit: string | { id: string } } | [organizationalUnit: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const organizationalUnits = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
}

export default organizationalUnits
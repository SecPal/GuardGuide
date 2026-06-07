import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CustomerController::index
* @see app/Http/Controllers/CustomerController.php:19
* @route '/customers'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/customers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CustomerController::index
* @see app/Http/Controllers/CustomerController.php:19
* @route '/customers'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::index
* @see app/Http/Controllers/CustomerController.php:19
* @route '/customers'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerController::index
* @see app/Http/Controllers/CustomerController.php:19
* @route '/customers'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CustomerController::index
* @see app/Http/Controllers/CustomerController.php:19
* @route '/customers'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerController::index
* @see app/Http/Controllers/CustomerController.php:19
* @route '/customers'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerController::index
* @see app/Http/Controllers/CustomerController.php:19
* @route '/customers'
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
* @see \App\Http\Controllers\CustomerController::store
* @see app/Http/Controllers/CustomerController.php:42
* @route '/customers'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/customers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CustomerController::store
* @see app/Http/Controllers/CustomerController.php:42
* @route '/customers'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::store
* @see app/Http/Controllers/CustomerController.php:42
* @route '/customers'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CustomerController::store
* @see app/Http/Controllers/CustomerController.php:42
* @route '/customers'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CustomerController::store
* @see app/Http/Controllers/CustomerController.php:42
* @route '/customers'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\CustomerController::update
* @see app/Http/Controllers/CustomerController.php:59
* @route '/customers/{customer}'
*/
export const update = (args: { customer: string | { id: string } } | [customer: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/customers/{customer}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CustomerController::update
* @see app/Http/Controllers/CustomerController.php:59
* @route '/customers/{customer}'
*/
update.url = (args: { customer: string | { id: string } } | [customer: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { customer: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            customer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        customer: typeof args.customer === 'object'
        ? args.customer.id
        : args.customer,
    }

    return update.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::update
* @see app/Http/Controllers/CustomerController.php:59
* @route '/customers/{customer}'
*/
update.put = (args: { customer: string | { id: string } } | [customer: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\CustomerController::update
* @see app/Http/Controllers/CustomerController.php:59
* @route '/customers/{customer}'
*/
const updateForm = (args: { customer: string | { id: string } } | [customer: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CustomerController::update
* @see app/Http/Controllers/CustomerController.php:59
* @route '/customers/{customer}'
*/
updateForm.put = (args: { customer: string | { id: string } } | [customer: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

const customers = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
}

export default customers
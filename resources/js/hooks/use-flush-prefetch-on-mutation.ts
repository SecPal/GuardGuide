import type { GlobalEvent } from '@inertiajs/core';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';

const MUTATION_METHODS = new Set<string>(['post', 'put', 'patch', 'delete']);

/**
 * Inertia caches prefetched page responses (the default lifetime is 30
 * seconds). Without active invalidation, any mutation performed in the
 * meantime can leave stale data on other, previously prefetched pages: e.g.
 * a newly created organizational unit would not appear in the user
 * assignments dropdowns until the cache expired or the user reloaded the
 * page.
 *
 * Listening for the `finish` router event lets us inspect the visit method
 * regardless of whether the request succeeded, was redirected, or returned
 * validation errors, and flush the prefetch cache after every mutation so
 * subsequent navigation always fetches fresh data.
 *
 * `flushAll` alone is not enough: in `@inertiajs/core` 3.3 it only clears
 * the already-resolved `cached` entries (and their removal timers) and
 * leaves in-flight prefetch requests untouched. A prefetch that was
 * triggered (e.g. by hover) just before the mutation finished would
 * resolve afterwards and push its now-stale response back into the cache.
 * Cancelling async prefetch requests first rejects those in-flight
 * promises so their `then` handler never runs and the freshly flushed
 * cache stays empty.
 */
export function useFlushPrefetchOnMutation(): void {
    useEffect(() => {
        return router.on('finish', (event: GlobalEvent<'finish'>) => {
            const method = event.detail.visit.method;

            if (!MUTATION_METHODS.has(method)) {
                return;
            }

            router.cancelAll({
                async: true,
                prefetch: true,
                sync: false,
            });
            router.flushAll();
        });
    }, []);
}

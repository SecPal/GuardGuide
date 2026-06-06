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
 */
export function useFlushPrefetchOnMutation(): void {
    useEffect(() => {
        return router.on('finish', (event: GlobalEvent<'finish'>) => {
            const method = event.detail.visit.method;

            if (!MUTATION_METHODS.has(method)) {
                return;
            }

            router.flushAll();
        });
    }, []);
}

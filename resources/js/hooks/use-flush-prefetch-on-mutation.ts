import { router } from '@inertiajs/react';
import { useEffect } from 'react';

const MUTATION_METHODS = new Set(['post', 'put', 'patch', 'delete']);

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
        return router.on('finish', (event) => {
            const visit = (event as CustomEvent).detail?.visit as
                | { method?: string }
                | undefined;
            const method = visit?.method;

            if (typeof method !== 'string') {
                return;
            }

            if (!MUTATION_METHODS.has(method.toLowerCase())) {
                return;
            }

            router.flushAll();
        });
    }, []);
}

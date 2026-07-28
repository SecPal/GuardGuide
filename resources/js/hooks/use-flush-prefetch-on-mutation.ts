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
 * `flushAll` alone is not enough: in `@inertiajs/core` 3.3 it only clears
 * the already-resolved `cached` entries (and their removal timers) and
 * leaves in-flight prefetch requests untouched. A prefetch that was
 * triggered (e.g. by hover) just before the mutation finished resolves
 * afterwards and its registered `.then` handler pushes the now-stale
 * response back into the cache.
 *
 * Rather than calling `router.cancelAll` to abort the in-flight prefetch
 * promise — which would also kill unrelated async traffic like
 * `router.reload()`, polling, or deferred props — we track each prefetch's
 * start time via `prefetching`/`prefetched` events. When a prefetch
 * resolves after we've recorded a mutation finish, we know its response
 * was generated before the server state changed and re-flush the cache.
 * The flush is deferred to the next macrotask so it runs after Inertia's
 * own `.then` chain has populated the cache for this prefetch entry.
 */
export function useFlushPrefetchOnMutation(): void {
    useEffect(() => {
        const inFlightPrefetches = new Map<string, number>();
        const pendingFlushTimeouts = new Set<number>();
        let lastMutationAt = 0;

        const offPrefetching = router.on(
            'prefetching',
            (event: GlobalEvent<'prefetching'>) => {
                inFlightPrefetches.set(event.detail.visit.url.href, Date.now());
            },
        );

        const offPrefetched = router.on(
            'prefetched',
            (event: GlobalEvent<'prefetched'>) => {
                const url = event.detail.visit.url.href;
                const startedAt = inFlightPrefetches.get(url);
                inFlightPrefetches.delete(url);

                if (startedAt === undefined || startedAt >= lastMutationAt) {
                    return;
                }

                const flushTimeout = window.setTimeout(() => {
                    pendingFlushTimeouts.delete(flushTimeout);
                    router.flushAll();
                }, 0);

                pendingFlushTimeouts.add(flushTimeout);
            },
        );

        const offFinish = router.on(
            'finish',
            (event: GlobalEvent<'finish'>) => {
                const method = event.detail.visit.method;

                if (!MUTATION_METHODS.has(method)) {
                    return;
                }

                lastMutationAt = Date.now();
                router.flushAll();
            },
        );

        return () => {
            offPrefetching();
            offPrefetched();
            offFinish();
            pendingFlushTimeouts.forEach((flushTimeout) =>
                window.clearTimeout(flushTimeout),
            );
        };
    }, []);
}

import { useFlushPrefetchOnMutation } from '@/hooks/use-flush-prefetch-on-mutation';

/**
 * Render-null component that owns Inertia-wide cache management side
 * effects so the mutation-driven prefetch flush always runs once for the
 * application, regardless of which top-level layout is mounted for the
 * current page.
 */
export function InertiaCacheManager(): null {
    useFlushPrefetchOnMutation();

    return null;
}

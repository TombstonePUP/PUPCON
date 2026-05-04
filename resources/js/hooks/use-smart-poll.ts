import { router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

/**
 * Smart Polling Hook
 *
 * Automatically reloads the current page data at a specified interval,
 * but only if the tab is currently active (visible).
 *
 * @param interval - Polling interval in milliseconds (default: 5000)
 * @param only - Optional array of keys to refresh (e.g., ['users', 'stats'])
 */
export function useSmartPoll(interval: number = 5000, only?: string[]) {
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const poll = () => {
            // Only reload if the document is visible
            if (document.visibilityState === 'visible') {
                router.reload({
                    only: only,
                    preserveScroll: true,
                    preserveState: true,
                    onFinish: () => {
                        // Reschedule the next poll after the current one finishes
                        // This prevents overlapping requests if the server is slow
                        timerRef.current = setTimeout(poll, interval);
                    },
                });
            } else {
                // If not visible, just wait and check again later
                timerRef.current = setTimeout(poll, interval);
            }
        };

        // Start the first timer
        timerRef.current = setTimeout(poll, interval);

        // Cleanup on unmount
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [interval, only]);
}

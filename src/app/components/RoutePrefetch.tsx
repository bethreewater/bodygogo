'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { prefetchClientJson } from '@/lib/client-cache';

const PREFETCH_ROUTES = [
    '/',
    '/body',
    '/food',
    '/workout',
    '/community',
    '/algorithms',
    '/profile',
    '/settings',
    '/login'
];

export function RoutePrefetch() {
    const router = useRouter();

    useEffect(() => {
        const prefetchAll = () => {
            PREFETCH_ROUTES.forEach((route) => {
                router.prefetch(route);
            });

            const today = new Date().toISOString().split('T')[0];
            prefetchClientJson(`/api/home?date=${today}`);
            prefetchClientJson(`/api/body?date=${today}`);
            prefetchClientJson(`/api/food?date=${today}`);
            prefetchClientJson(`/api/workout?date=${today}`);
            prefetchClientJson(`/api/community`);
            prefetchClientJson(`/api/profile?date=${today}`);
            prefetchClientJson(`/api/settings`);
        };

        const requestIdle = (window as Window & {
            requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        }).requestIdleCallback;
        const cancelIdle = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;

        if (requestIdle) {
            const id = requestIdle(prefetchAll, { timeout: 1500 });
            return () => cancelIdle?.(id);
        }

        const timeout = window.setTimeout(prefetchAll, 300);
        return () => window.clearTimeout(timeout);
    }, [router]);

    return null;
}

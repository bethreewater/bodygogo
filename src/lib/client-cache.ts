'use client';

import { useEffect, useState } from 'react';

type CacheValue<T> = {
    data: T;
    ts: number;
};

const clientCache = new Map<string, CacheValue<unknown>>();
const inflight = new Map<string, Promise<unknown>>();
let cacheVersion = 0;
const subscribers = new Set<() => void>();

function notifySubscribers() {
    cacheVersion += 1;
    subscribers.forEach((fn) => fn());
}

function useCacheVersion() {
    const [version, setVersion] = useState(cacheVersion);

    useEffect(() => {
        const handler = () => setVersion(cacheVersion);
        subscribers.add(handler);
        return () => {
            subscribers.delete(handler);
        };
    }, []);

    return version;
}

export function invalidateClientCache(prefix?: string) {
    if (!prefix) {
        clientCache.clear();
        notifySubscribers();
        return;
    }
    for (const key of clientCache.keys()) {
        if (key.startsWith(prefix)) clientCache.delete(key);
    }
    notifySubscribers();
}

export async function prefetchClientJson<T>(url: string): Promise<T | null> {
    if (clientCache.has(url)) return clientCache.get(url)?.data as T;
    const existing = inflight.get(url) as Promise<T> | undefined;
    if (existing) return existing;

    const request = fetch(url, { credentials: 'include' })
        .then(async (res) => {
            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }
            return res.json() as Promise<T>;
        })
        .then((data) => {
            clientCache.set(url, { data, ts: Date.now() });
            return data;
        })
        .finally(() => {
            inflight.delete(url);
        });

    inflight.set(url, request);
    return request;
}

export function useClientJson<T>(url?: string | null) {
    const cacheBuster = useCacheVersion();
    const [data, setData] = useState<T | null>(() => {
        if (!url) return null;
        return (clientCache.get(url)?.data as T) ?? null;
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(() => {
        if (!url) return false;
        return !clientCache.has(url);
    });

    useEffect(() => {
        if (!url) return;
        let active = true;

        const cached = clientCache.get(url);
        if (cached) {
            setData(cached.data as T);
            setLoading(false);
            return;
        }

        setError(null);
        setLoading(true);
        prefetchClientJson<T>(url)
            .then((payload) => {
                if (!active || payload === null) return;
                setData(payload);
                setLoading(false);
            })
            .catch((err: Error) => {
                if (!active) return;
                setError(err.message);
                setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [url, cacheBuster]);

    return { data, error, loading };
}

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import {
    getUserProfile,
    getLastGameState,
    getGameStateBefore,
    getWeightTrend,
    getFoodHistory,
    getWorkoutHistory,
    getCommunityUsers
} from './data/supabase-repository';
import { getDashboardViewModel, getDailyLogs } from './algorithms/brain';
import { getCommunityFeed } from './algorithms/community';
import { getViewerId } from './data/supabase-repository';
import { dashboardTagForDate, dailyLogsTagForDate } from './server/cache-tags';

/**
 * React 18 Cache Layer
 * 
 * Prevents duplicate queries within the same request.
 * For example, if Dashboard and Profile both call getUserProfile(),
 * the database is only hit once.
 */

// Core Data
export const getCachedProfile = cache(getUserProfile);
export const getCachedGameState = cache((date: string) => getLastGameState(date));
export const getCachedGameStateBefore = cache((date: string) => getGameStateBefore(date));

// Dashboard (Heavy query)
export const getCachedDashboard = cache(async (date: string) => {
    const uid = await getViewerId();
    const cached = unstable_cache(
        () => getDashboardViewModel(date),
        ['dashboard', uid ?? 'anon', date],
        { revalidate: 30, tags: [dashboardTagForDate(uid, date)] }
    );
    return cached();
});

export const getCachedDailyLogs = cache(async (date: string) => {
    const uid = await getViewerId();
    const cached = unstable_cache(
        () => getDailyLogs(date),
        ['dailylogs', uid ?? 'anon', date],
        { revalidate: 30, tags: [dailyLogsTagForDate(uid, date)] }
    );
    return cached();
});

// History Data
export const getCachedWeightTrend = cache((days: number) => getWeightTrend(days));
export const getCachedFoodHistory = cache((days: number) => getFoodHistory(days));
export const getCachedWorkoutHistory = cache((days: number) => getWorkoutHistory(days));

// Community
export const getCachedCommunityFeed = cache(getCommunityFeed);
export const getCachedCommunityUsers = cache(getCommunityUsers);

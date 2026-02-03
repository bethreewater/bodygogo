

import { revalidateTag } from 'next/cache';
import { revalidatePath } from 'next/cache';
import { getViewerId } from '@/lib/data/supabase-repository';

export function dashboardTagForDate(uid: string | null, date: string) {
    return `dashboard:${uid ?? 'anon'}:${date}`;
}

export function dailyLogsTagForDate(uid: string | null, date: string) {
    return `dailylogs:${uid ?? 'anon'}:${date}`;
}

export async function revalidateDashboard(date: string) {
    const uid = await getViewerId();
    revalidateTag(dashboardTagForDate(uid, date), 'default');
}

export async function revalidatePathsAndDashboard(paths: string[], date: string) {
    const uid = await getViewerId();
    paths.forEach((path) => revalidatePath(path));
    revalidateTag(dashboardTagForDate(uid, date), 'default');
    revalidateTag(dailyLogsTagForDate(uid, date), 'default');
}

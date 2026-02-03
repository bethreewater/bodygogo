

import { revalidateTag } from 'next/cache';
import { revalidatePath } from 'next/cache';

export function dashboardTagForDate(date: string) {
    return `dashboard:${date}`;
}

export function revalidateDashboard(date: string) {
    revalidateTag(dashboardTagForDate(date), 'default');
}

export function revalidatePathsAndDashboard(paths: string[], date: string) {
    paths.forEach((path) => revalidatePath(path));
    revalidateDashboard(date);
}

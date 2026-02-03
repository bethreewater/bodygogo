'use server';

import { getUserSettings, updateUserSettings, updateUserProfile, resetUserData } from '@/lib/data/supabase-repository';
import { signout } from './auth';
import { revalidatePathsAndDashboard } from '@/lib/server/cache-tags';
import { revalidatePath } from 'next/cache';
import { getTodayDateString } from '@/lib/core/date-utils';
import { UserProfile } from '@/lib/core/types';


export async function setTheme(theme: 'cozy_light' | 'cozy_dark') {
    await updateUserSettings({ theme });
    revalidatePath('/settings');
}

export async function toggleNotifications() {
    const settings = await getUserSettings();
    await updateUserSettings({ notifications: !settings.notifications });
    revalidatePath('/settings');
}

export async function setUnits(units: 'metric' | 'imperial') {
    await updateUserSettings({ units });
    revalidatePath('/settings');
}

export async function setPrivacy(privacy: 'public' | 'private') {
    await updateUserSettings({ privacy });
    revalidatePath('/settings');
}

export { signout as signOut }; // Re-export from auth.ts for backwards compatibility

export async function updateProfile(data: Partial<UserProfile>) {
    await updateUserProfile(data);
    revalidatePathsAndDashboard(['/profile', '/community'], getTodayDateString());
    return { success: true };
}

export async function resetAccount() {
    await resetUserData();

    // Aggressively revalidate all paths to clear Data Cache
    revalidatePath('/', 'layout'); // Clears everything under root
    revalidatePathsAndDashboard(['/', '/profile', '/body', '/community', '/food', '/workout'], getTodayDateString());

    return { success: true };
}

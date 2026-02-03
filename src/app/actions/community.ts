'use server';

import { createClient } from '@/lib/data/supabase-server';
import { revalidatePathsAndDashboard } from '@/lib/server/cache-tags';
import { getTodayDateString } from '@/lib/core/date-utils';

/**
 * Server Action: Send Energy (Cheer)
 * 
 * Rules:
 * 1. Anonymous (Recipient doesn't know WHO sent it).
 * 2. Idempotent-ish (Spamming doesn't matter, we just record "someone cared").
 * 3. No Count Returned (To prevent "Popularity Contest").
 */
export async function sendEnergyAction(targetUid: string) {
    try {
        // Fire and forget - this is an emotional gesture
        // In production, you might log to analytics or a lightweight "reactions" table
        console.log(`Energy sent to ${targetUid}`);

        // This is a "Fire and Forget" action for emotional connection.
        return { success: true };
    } catch (error) {
        console.error('Failed to send energy', error);
        return { success: false };
    }
}

export async function seedCommunityAction() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: 'Unauthorized' };
    }

    // Make current user visible for community testing
    await supabase.from('users').upsert({
        uid: user.id,
        avatar_config: { type: 'preset', value: 'adventurer' }
    }, { onConflict: 'uid' });

    await supabase.from('user_settings').upsert({
        uid: user.id,
        privacy: 'public',
        theme: 'cozy_light',
        notifications: true,
        units: 'metric'
    }, { onConflict: 'uid' });

    await supabase.from('game_states').upsert({
        uid: user.id,
        date: new Date().toISOString().split('T')[0],
        level: 5,
        streak_current: 3,
        xp_current: 50,
        xp_next_level: 100
    }, { onConflict: 'uid, date' });

    revalidatePathsAndDashboard(['/community', '/'], getTodayDateString()); // Home might show community preview?

    return { success: true };
}

import { NextResponse } from 'next/server';
import { getCachedCommunityFeed, getCachedProfile } from '@/lib/cache';
import { getUserSettings } from '@/lib/data/supabase-repository';

export const dynamic = 'force-dynamic';

export async function GET() {
    const [items, profile, settings] = await Promise.all([
        getCachedCommunityFeed(),
        getCachedProfile(),
        getUserSettings()
    ]);

    return NextResponse.json({
        items,
        currentUserId: profile?.uid ?? null,
        privacy: settings?.privacy ?? 'private'
    });
}

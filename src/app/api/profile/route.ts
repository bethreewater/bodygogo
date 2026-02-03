import { NextResponse } from 'next/server';
import { getCachedProfile, getCachedGameState, getCachedDashboard } from '@/lib/cache';
import { getTodayDateString } from '@/lib/core/date-utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || getTodayDateString();

    const [profile, gameState, viewModel] = await Promise.all([
        getCachedProfile(),
        getCachedGameState(date),
        getCachedDashboard(date)
    ]);

    return NextResponse.json({ profile, gameState, viewModel });
}

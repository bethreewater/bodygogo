import { NextResponse } from 'next/server';
import { getCachedDashboard, getCachedDailyLogs, getCachedFoodHistory } from '@/lib/cache';
import { getTodayDateString } from '@/lib/core/date-utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || getTodayDateString();

    const [viewModel, logs, weeklyData] = await Promise.all([
        getCachedDashboard(date),
        getCachedDailyLogs(date),
        getCachedFoodHistory(7)
    ]);

    return NextResponse.json({ viewModel, logs, weeklyData });
}

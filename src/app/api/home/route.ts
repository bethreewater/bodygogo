import { NextResponse } from 'next/server';
import { getCachedDashboard, getCachedDailyLogs } from '@/lib/cache';
import { getTodayDateString } from '@/lib/core/date-utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || getTodayDateString();

    const [viewModel, logs] = await Promise.all([
        getCachedDashboard(date),
        getCachedDailyLogs(date)
    ]);

    return NextResponse.json({ viewModel, logs });
}

import { NextResponse } from 'next/server';
import { getUserSettings } from '@/lib/data/supabase-repository';

export const dynamic = 'force-dynamic';

export async function GET() {
    const settings = await getUserSettings();
    return NextResponse.json({ settings });
}

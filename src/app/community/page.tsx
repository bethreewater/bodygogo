import React from 'react';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getCachedCommunityFeed, getCachedProfile } from '@/lib/cache';
import { getUserSettings } from '@/lib/data/supabase-repository';
import { CommunityFeed } from '@/app/components/community/CommunityFeed';
import Link from 'next/link';
import { UserIcon } from '@/app/components/icons/UserIcon';

/**
 * Community Page (Server Component)
 * Refactored to match 'Cozy Pixel' Design System (Mobile First Container)
 */
export default async function CommunityPage() {
    // 1. Fetch Data
    const feedItems = await getCachedCommunityFeed();

    // 2. Identify Current User
    const profile = await getCachedProfile();
    const settings = await getUserSettings();
    const currentUserId = profile?.uid;

    return (
        <main style={{
            backgroundColor: 'var(--bg-app)',
            minHeight: '100vh',
            padding: '2rem 1.5rem',
            paddingBottom: '8rem', // Tabbar spacing
            maxWidth: '480px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
        }}>
            {/* Premium Nav Header */}
            <header className="flex justify-between items-center">
                <Link href="/" className="premium-icon-btn no-underline" aria-label="返回">
                    <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>←</span>
                </Link>

                <Link href="/profile" className="premium-icon-btn no-underline" aria-label="個人檔案">
                    <UserIcon />
                </Link>
            </header>

            <CommunityFeed
                items={feedItems}
                currentUserId={currentUserId}
                currentPrivacy={settings.privacy}
            />
        </main>
    );
}

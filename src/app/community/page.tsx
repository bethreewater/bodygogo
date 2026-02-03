'use client';

import { CommunityFeed } from '@/app/components/community/CommunityFeed';
import Link from 'next/link';
import { UserIcon } from '@/app/components/icons/UserIcon';
import { useClientJson } from '@/lib/client-cache';
import { PageLoading } from '@/app/components/PageLoading';
import type { FeedItem, UserSettings } from '@/lib/core/types';

/**
 * Community Page (Client Component)
 * Refactored to match 'Cozy Pixel' Design System (Mobile First Container)
 */
type CommunityPayload = {
    items: FeedItem[];
    currentUserId: string | null;
    privacy: UserSettings['privacy'];
};

export default function CommunityPage() {
    const { data, loading, error } = useClientJson<CommunityPayload>('/api/community');

    if (loading) {
        return <PageLoading title="載入社群動態中..." />;
    }

    if (!data || error) {
        return (
            <main style={{ maxWidth: '480px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>載入失敗，請稍後再試。</p>
            </main>
        );
    }

    const { items, currentUserId, privacy } = data;

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
                items={items}
                currentUserId={currentUserId}
                currentPrivacy={privacy}
            />
        </main>
    );
}

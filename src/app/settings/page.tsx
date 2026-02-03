'use client';

import Link from 'next/link';
import { SettingsList } from './SettingsList';
import { SignOutButton } from './SignOutButton';
import { ResetButton } from './ResetButton';
import { useClientJson } from '@/lib/client-cache';
import { PageLoading } from '@/app/components/PageLoading';
import type { UserSettings } from '@/lib/core/types';

type SettingsPayload = { settings: UserSettings };

export default function SettingsPage() {
    const { data, loading, error } = useClientJson<SettingsPayload>('/api/settings');

    if (loading) {
        return <PageLoading title="載入設定中..." />;
    }

    if (!data || error) {
        return (
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>載入失敗，請稍後再試。</p>
            </div>
        );
    }

    const { settings } = data;

    return (
        <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '2rem',
            paddingBottom: '8rem', // Adjusted for bottom nav
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
        }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link href="/" style={{ fontSize: '1.5rem', textDecoration: 'none', color: 'var(--text-secondary)' }}>←</Link>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>設定</h1>
            </header>

            {/* Interactive List (Preferences + Privacy) */}
            <SettingsList settings={settings} />

            <section style={{ marginTop: '2rem' }}>
                <ResetButton />
                <div style={{ marginTop: '1rem' }}>
                    <SignOutButton />
                </div>
            </section>
        </div>
    );
}

import Link from 'next/link';
import { getUserSettings } from '@/lib/data/supabase-repository';
import { SettingsList } from './SettingsList';
import { SignOutButton } from './SignOutButton';
import { ResetButton } from './ResetButton';

export default async function SettingsPage() {
    const settings = await getUserSettings();

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

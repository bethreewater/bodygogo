import { ProfileEditableGrid } from './ProfileEditableGrid';
import { ProfileHeader } from './ProfileHeader';
import { getCachedProfile, getCachedGameState, getCachedDashboard } from '@/lib/cache';
import Link from 'next/link';

// Profile is relatively static
export const revalidate = 60;

export default async function ProfilePage() {
    const today = new Date().toISOString().split('T')[0];

    // OPTIMIZATION: Parallel fetch with cache
    const [profile, gameState, viewModel] = await Promise.all([
        getCachedProfile(),
        getCachedGameState(today),
        getCachedDashboard(today)
    ]);

    const { metrics } = viewModel;

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Link href="/" className="text-blue-500">請先建立檔案</Link>
            </div>
        );
    }

    // --- Calculations ---
    const weight = metrics.weight.value || 0;

    // Age
    const birthDate = new Date(profile.birth_date);
    const now = new Date();
    let age = now.getFullYear() - birthDate.getFullYear();
    const m = now.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
        age--;
    }

    const bmr = metrics.bmr.value;
    const tdee = metrics.tdee.value;

    return (
        <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '2rem',
            paddingBottom: '8rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
        }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link href="/" style={{ fontSize: '1.5rem', textDecoration: 'none', color: 'var(--text-secondary)' }}>←</Link>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>個人檔案</h1>
            </header>

            {/* Identity Card */}
            <ProfileHeader profile={profile} gameState={gameState} />

            {/* Personal Details */}
            {/* Editable Stats */}
            <ProfileEditableGrid profile={profile} age={age} weight={weight} />

            {/* Metabolic Reference (Read-Only Derived) */}
            <section>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    代謝參考 (自動計算)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    <StatBox label="基礎代謝 (BMR)" value={bmr ? `${bmr}` : '--'} sub="kcal" />
                    <StatBox label="每日總消 (TDEE)" value={tdee ? `${tdee}` : '--'} sub="kcal" />
                </div>
            </section>

            {/* Badges / Achievements */}
            <section>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    成就徽章
                </h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Badge icon="🌱" label="新手上路" />
                    <Badge icon="🔥" label="7日連勝" unlocked={gameState.streak_current >= 7} />
                    <Badge icon="⚔️" label="勇者無懼" unlocked={gameState.level >= 5} />
                    <Badge icon="🧘" label="心靈大師" unlocked={false} />
                </div>
            </section>
        </div>
    );
}

function StatBox({ label, value, sub, highlight = false }: { label: string, value: string, sub?: string, highlight?: boolean }) {
    return (
        <div style={{
            background: highlight ? 'var(--bg-card)' : 'var(--bg-card)', // Can use different bg for highlight
            border: highlight ? '2px solid var(--primary)' : 'none',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-soft)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }}>
            <div style={{ fontSize: '0.75rem', color: highlight ? 'var(--primary)' : 'var(--text-tertiary)', marginBottom: '0.25rem', fontWeight: highlight ? 700 : 400 }}>{label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</div>
                {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{sub}</div>}
            </div>
        </div>
    );
}

function Badge({ icon, label, unlocked = true }: { icon: string, label: string, unlocked?: boolean }) {
    return (
        <div style={{
            background: unlocked ? 'var(--bg-card)' : 'rgba(0,0,0,0.05)',
            opacity: unlocked ? 1 : 0.5,
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            minWidth: '100px',
            boxShadow: unlocked ? 'var(--shadow-soft)' : 'none'
        }}>
            <span style={{ fontSize: '2rem', filter: unlocked ? 'none' : 'grayscale(100%)' }}>{icon}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</span>
        </div>
    );
}

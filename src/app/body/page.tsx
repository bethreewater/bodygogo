
import { getCachedDashboard, getCachedDailyLogs, getCachedWeightTrend } from '@/lib/cache';
import { WeightEntryForm, HistoryList } from '@/app/components/Forms';
import { DateSwitcher } from '@/app/components/DateSwitcher';
import { BodyMetricsGrid } from './BodyMetricsGrid';
import { GoalTimelineCard } from '@/app/components/GoalTimelineCard';

export const revalidate = 30;

export default async function BodyPage({
    searchParams,
}: {
    searchParams: Promise<{ date?: string }>;
}) {
    const params = await searchParams;
    const today = new Date().toISOString().split('T')[0];
    const selectedDate = params.date || today;

    // OPTIMIZATION: Parallel fetch
    const [viewModel, logs, weightTrend] = await Promise.all([
        getCachedDashboard(selectedDate),
        getCachedDailyLogs(selectedDate),
        getCachedWeightTrend(14)
    ]);

    const { metrics, date } = viewModel;

    const weight = metrics.weight.value;
    const bmr = metrics.bmr.value;
    const tdee = metrics.tdee.value;

    return (
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '3rem 2rem', paddingBottom: '8rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {/* Header */}
            <header style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        身體數據
                    </h1>
                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        每一次紀錄，都是對自己的重視。
                    </p>
                </div>
                <DateSwitcher currentDate={date} />
            </header>

            {/* Metrics Grid (Interactive) */}
            <BodyMetricsGrid
                weight={weight}
                bmr={bmr}
                tdee={tdee}
                weightTrend={weightTrend}
            />

            {/* Goal Timeline */}
            {viewModel.goal_projection && (
                <GoalTimelineCard projection={viewModel.goal_projection} />
            )}

            {/* Input Form */}
            <section>
                <h2 style={{ fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    更新紀錄
                </h2>
                <WeightEntryForm />
            </section>

            {/* History */}
            <section style={{
                background: 'var(--bg-card)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-soft)'
            }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    近期變化
                </h3>
                <HistoryList items={logs.body} />
            </section>
        </div>
    );
}

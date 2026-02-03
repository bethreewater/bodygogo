import { getCachedDashboard, getCachedDailyLogs, getCachedWorkoutHistory } from '@/lib/cache';
import { WorkoutEntryForm, HistoryList } from '@/app/components/Forms';
import { WorkoutSummary } from '@/app/components/WorkoutSummary';
import { DateSwitcher } from '@/app/components/DateSwitcher';
import { WeeklyBarChart } from '@/app/components/WeeklyBarChart';

export const revalidate = 30;


export default async function WorkoutPage({
    searchParams,
}: {
    searchParams: Promise<{ date?: string }>;
}) {
    const params = await searchParams;
    const today = new Date().toISOString().split('T')[0];
    const selectedDate = params.date || today;

    // OPTIMIZATION: Parallel fetch
    const [viewModel, logs, weeklyData] = await Promise.all([
        getCachedDashboard(selectedDate),
        getCachedDailyLogs(selectedDate),
        getCachedWorkoutHistory(7)
    ]);

    const { metrics, targets, date } = viewModel;
    const caloriesOut = metrics.calories_out.status === 'ready' ? metrics.calories_out.value : null;

    return (
        <div style={{ paddingBottom: '8rem' }}>
            <div style={{ maxWidth: '640px', margin: '0 auto', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <header style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                            運動
                        </h1>
                        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            每一次呼吸，都是進步
                        </p>
                    </div>
                    <DateSwitcher currentDate={date} />
                </header>

                <WorkoutSummary logs={logs.workout} targetCalories={targets.calories_out} caloriesOut={caloriesOut} />

                {/* Weekly Chart */}
                <section style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-soft)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            本週消耗
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>平均 350 kcal</span>
                    </div>
                    <WeeklyBarChart
                        data={weeklyData}
                        labels={['一', '二', '三', '四', '五', '六', '日']}
                        color="#22c55e" // Green for success/workout
                    />
                </section>

                <section>
                    <h2 style={{ fontSize: '0.875rem', marginBottom: '2rem', fontWeight: 500, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>記錄今日</h2>
                    <WorkoutEntryForm />
                </section>

                <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '1.5rem', color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>歷史</h3>
                    <HistoryList items={logs.workout} />
                </section>
            </div>
        </div>
    );
}

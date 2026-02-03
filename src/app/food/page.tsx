'use client';

import { NutritionSummary } from '@/app/components/NutritionSummary';
import { FoodEntryForm, HistoryList } from '@/app/components/Forms';
import { DateSwitcher } from '@/app/components/DateSwitcher';
import { WeeklyBarChart } from '@/app/components/WeeklyBarChart';

import { useSearchParams } from 'next/navigation';
import { useClientJson } from '@/lib/client-cache';
import { PageLoading } from '@/app/components/PageLoading';
import type { DashboardViewModel, BodyLog, FoodLog, WorkoutLog } from '@/lib/core/types';

type FoodPayload = {
    viewModel: DashboardViewModel;
    logs: {
        body: BodyLog[];
        food: FoodLog[];
        workout: WorkoutLog[];
        latestWeight: BodyLog | null;
    };
    weeklyData: number[];
};

export default function FoodPage() {
    const searchParams = useSearchParams();
    const today = new Date().toISOString().split('T')[0];
    const selectedDate = searchParams.get('date') || today;

    const { data, loading, error } = useClientJson<FoodPayload>(`/api/food?date=${selectedDate}`);

    if (loading) {
        return <PageLoading title="載入飲食紀錄中..." />;
    }

    if (!data || error) {
        return (
            <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>載入失敗，請稍後再試。</p>
            </div>
        );
    }

    const { viewModel, logs, weeklyData } = data;
    const { metrics, targets, date } = viewModel;

    const totalIntake = metrics.calories_in.status === 'ready' ? (metrics.calories_in.value || 0) : 0;

    const targetCalories = targets.calories_intake;
    const macros = metrics.macros?.value || { protein: 0, fat: 0, carbs: 0 };

    return (
        <div style={{ paddingBottom: '8rem' }}>
            <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <header>
                    <DateSwitcher currentDate={date} />
                </header>

                <NutritionSummary
                    calories={totalIntake}
                    targetCalories={targetCalories}
                    protein={macros.protein}
                    fat={macros.fat}
                    carbs={macros.carbs}
                    logs={logs.food}
                />

                {/* Weekly Chart */}
                <section style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-soft)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            本週攝取
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>平均 2000 kcal</span>
                    </div>
                    <WeeklyBarChart
                        data={weeklyData}
                        labels={['一', '二', '三', '四', '五', '六', '日']}
                        color="var(--text-primary)"
                    />
                </section>

                <section>
                    <h2 style={{ fontSize: '0.875rem', marginBottom: '2rem', fontWeight: 500, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>記錄今日</h2>
                    <FoodEntryForm />
                </section>

                <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '1.5rem', color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>歷史</h3>
                    <HistoryList items={logs.food} />
                </section>
            </div>
        </div>
    );
}

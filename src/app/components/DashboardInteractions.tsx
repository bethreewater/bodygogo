'use client';

import { useState } from 'react';
import { InteractivePixelHero } from './InteractivePixelHero';
import { DashboardMetricsGrid } from './DashboardMetricsGrid';
import { QuestSection } from './QuestSection';
import { InteractiveTrendGrid } from './InteractiveTrendGrid';
import { OnboardingWizard } from './OnboardingWizard';
import { BodyLog, DashboardViewModel, FoodLog, WorkoutLog } from '@/lib/core/types';

interface DashboardInteractionsProps {
    viewModel: DashboardViewModel;
    logs: {
        body: BodyLog[];
        food: FoodLog[];
        workout: WorkoutLog[];
    };
}

export function DashboardInteractions({ viewModel, logs }: DashboardInteractionsProps) {
    const { metrics, quests, trends, bodyStatus, targets } = viewModel;
    const [showWizard, setShowWizard] = useState(false);

    // Derived Data
    const caloriesVal = metrics.calories_net.status === 'ready' ? metrics.calories_net.value : null;
    const caloriesOutVal = metrics.calories_out.status === 'ready' ? metrics.calories_out.value : null;
    const caloriesInVal = metrics.calories_in.status === 'ready' ? metrics.calories_in.value : null;
    const streakDays = metrics.streak.status === 'ready' ? (metrics.streak.value || 0) : 0;
    const currentStatus = bodyStatus || '穩定';
    const trendCalories = trends?.calories_net || [];
    const trendMinutes = trends?.minutes || [];

    // Quest Logic
    const questCompletionRatio = metrics.quest_completion.status === 'ready' ? (metrics.quest_completion.value || 0) : 0;
    const isSetupAvailable = quests.items.some(q => q.id === 'q_setup_profile' && q.status === 'available');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* 2. Hero Image: Interactive Pixel Room */}
            <section style={{
                background: '#FDFCF8',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)'
            }}>
                <InteractivePixelHero
                    metrics={{
                        calories_net: caloriesVal ?? 0,
                        calories_out: caloriesOutVal ?? 0,
                        streak: streakDays,
                        // v2 Props
                        calories_in: caloriesInVal ?? 0,
                        weight: metrics.weight.value,
                        // v2: Pass Macros and BodyFat (if available in viewModel)
                        macros: metrics.macros?.status === 'ready' ? metrics.macros.value : undefined,
                        // Note: BodyFat might need to be added to DashboardViewModel if not present, checking types... 
                        // If not present, we pass null.
                        body_fat: null
                    }}
                    logs={logs}
                    targets={targets}
                    questCompletion={questCompletionRatio}
                    isSetupAvailable={isSetupAvailable}
                    onSetupClick={() => setShowWizard(true)}
                />
            </section>

            {/* 3. Bento Metrics Row (Interactive) */}
            <DashboardMetricsGrid
                caloriesVal={caloriesVal}
                burnVal={caloriesOutVal}
                currentStatus={currentStatus}
            />

            {/* 4. Quest List (Interactive Section) */}
            <QuestSection
                quests={quests.items}
                onSetupClick={() => setShowWizard(true)}
            />

            {/* 5. Mini Charts Row (Interactive) */}
            <InteractiveTrendGrid trendCalories={trendCalories} trendMinutes={trendMinutes} />

            {/* Wizard Modal */}
            {showWizard && <OnboardingWizard />}
        </div>
    );
}

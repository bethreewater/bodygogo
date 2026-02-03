'use client';

import { useState } from 'react';
import { WorkoutLog } from '@/lib/core/types';
import { QuickAddSheet } from './QuickAddSheet';

interface WorkoutSummaryProps {
    logs: WorkoutLog[];
    targetCalories: number;
    caloriesOut: number | null;
}

export function WorkoutSummary({ logs = [], targetCalories = 300, caloriesOut }: WorkoutSummaryProps) {
    const [isOpen, setIsOpen] = useState(false);

    const calories = caloriesOut ?? 0;
    const remaining = Math.max(0, targetCalories - calories);
    const progress = Math.min(100, (calories / targetCalories) * 100);

    return (
        <>
            <div
                onClick={() => setIsOpen(true)}
                style={{
                    background: 'var(--bg-card)',
                    padding: '1rem', // Reduced
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-soft)',
                    marginBottom: '1rem',
                    cursor: 'pointer',
                    transition: 'transform 0.1s active:scale-98'
                }}
            >
                {/* Header: Calories */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.75rem' }}>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            今日運動 <span style={{ fontSize: '0.75rem', background: 'var(--bg-app)', padding: '2px 6px', borderRadius: '4px' }}>詳細 ⓘ</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{calories}</span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>/ {targetCalories} kcal</span>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>剩餘</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 600, color: remaining < 0 ? 'var(--status-success)' : 'var(--text-primary)' }}>
                            {remaining}
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{ height: '6px', background: 'var(--bg-app)', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                    <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: 'var(--accent)',
                        borderRadius: '3px',
                        transition: 'width 0.5s ease'
                    }} />
                </div>

                {caloriesOut === null && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        尚未有運動紀錄
                    </div>
                )}
            </div>

            <QuickAddSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title="今日運動明細">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {logs.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '2rem' }}>
                            今日尚未有運動紀錄
                        </div>
                    ) : (
                        logs.map((log) => (
                            <div key={log.id} style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '1.25rem' }}>{log.category === 'strength' ? '💪' : '🏃‍♀️'}</span>
                                        <span>{log.type}</span>
                                    </div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.calories} kcal</div>
                                </div>

                                {/* Badges Row */}
                                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', marginBottom: (log.category === 'strength' && log.exercises?.length) ? '0.75rem' : 0 }}>
                                    <span style={{ color: 'var(--text-primary)', background: 'var(--bg-surface)', padding: '2px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                                        ⏱️ {log.duration_minutes} min
                                    </span>
                                </div>

                                {/* Exercises Detail for Strength */}
                                {log.category === 'strength' && log.exercises && log.exercises.length > 0 && (
                                    <div style={{
                                        borderTop: '1px solid rgba(0,0,0,0.05)',
                                        paddingTop: '0.75rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.5rem'
                                    }}>
                                        {log.exercises.map((ex, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                                                <span>{ex.name}</span>
                                                <span style={{ fontFamily: 'monospace', fontWeight: 500, color: 'var(--text-primary)' }}>
                                                    {ex.weight_kg}kg × {ex.reps}次 × {ex.sets}組
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </QuickAddSheet>
        </>
    );
}

 

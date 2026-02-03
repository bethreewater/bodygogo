'use client';

import { useState } from 'react';
import { QuickAddSheet } from './QuickAddSheet';
import { FoodLog } from '@/lib/core/types';

interface NutritionSummaryProps {
    calories: number;
    targetCalories: number;
    protein: number;
    fat: number;
    carbs: number;
    logs: FoodLog[];
}

export function NutritionSummary({ calories, targetCalories, protein, fat, carbs, logs }: NutritionSummaryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const remaining = Math.max(0, targetCalories - calories);
    const progress = Math.min(100, (calories / targetCalories) * 100);

    // Safeguard against undefined logs
    const safeLogs = logs || [];

    return (
        <>
            <div
                onClick={() => setIsOpen(true)}
                style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-soft)', marginBottom: '2rem', cursor: 'pointer', transition: 'transform 0.1s active:scale-98' }}
            >
                {/* Header: Calories */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            今日熱量 <span style={{ fontSize: '0.75rem', background: 'var(--bg-app)', padding: '2px 6px', borderRadius: '4px' }}>詳細 ⓘ</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{calories}</span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>/ {targetCalories} kcal</span>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>剩餘</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 600, color: remaining < 0 ? 'var(--status-danger)' : 'var(--text-primary)' }}>
                            {remaining}
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div style={{ height: '8px', background: 'var(--bg-app)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                    <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: progress > 100 ? 'var(--status-danger)' : 'var(--status-success)',
                        transition: 'width 0.5s ease'
                    }} />
                </div>

                {/* Macros Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <MacroItem label="蛋白質" value={protein} color="var(--accent)" unit="g" />
                    <MacroItem label="脂肪" value={fat} color="#EAB308" unit="g" />
                    <MacroItem label="碳水" value={carbs} color="#3B82F6" unit="g" />
                </div>
            </div>

            {/* Detailed Sheet */}
            <QuickAddSheet
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="今日飲食明細"
            >
                <div>
                    {safeLogs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                            尚未有紀錄
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {safeLogs.map((log) => (
                                <div key={log.id} style={{ background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.name}</div>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.calories} kcal</div>
                                    </div>

                                    {/* Mini Macro Badges */}
                                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
                                        <span style={{ color: 'var(--accent)', background: 'rgba(var(--accent-rgb), 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                                            P: {log.protein_g || 0}g
                                        </span>
                                        <span style={{ color: '#EAB308', background: 'rgba(234, 179, 8, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                                            F: {log.fat_g || 0}g
                                        </span>
                                        <span style={{ color: '#3B82F6', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                                            C: {log.carbs_g || 0}g
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </QuickAddSheet>
        </>
    );
}

function MacroItem({ label, value, color, unit }: { label: string, value: number, color: string, unit: string }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bg-app)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, marginBottom: '0.5rem' }}></div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>{label}</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {Math.round(value)}{unit}
            </div>
        </div>
    );
}

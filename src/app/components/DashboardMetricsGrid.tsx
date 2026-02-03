'use client';

import React, { useState } from 'react';
import { BentoMetric } from './BentoMetric';
import { QuickAddSheet } from './QuickAddSheet';

interface DashboardMetricsGridProps {
    caloriesVal: number | null;  // v2: allow null
    burnVal: number | null;   // v2: allow null
    currentStatus: string;
}

export function DashboardMetricsGrid({ caloriesVal, burnVal, currentStatus }: DashboardMetricsGridProps) {
    const [selectedHelp, setSelectedHelp] = useState<'calories' | 'burn' | 'status' | null>(null);

    const HELP_CONTENT = {
        calories: {
            title: '淨熱量說明',
            item: (
                <HelpItem
                    icon="🔥"
                    title="淨熱量 (Net Calories)"
                    formula="飲食攝取 - 運動消耗"
                    desc="這是體重控制最核心的數字。就像銀行帳戶一樣，我們關注的是「存下來」的熱量。"
                    source="來源：每日飲食紀錄減去運動消耗。"
                />
            )
        },
        burn: {
            title: '運動指標說明',
            item: (
                <HelpItem
                    icon="⏱"
                    title="運動消耗 (Calories Out)"
                    formula="運動消耗熱量"
                    desc="代表您今日運動所消耗的總熱量，是訓練與活動量的總結。"
                    source="來源：手動記錄的運動消耗。"
                />
            )
        },
        status: {
            title: '身體狀態說明',
            item: (
                <HelpItem
                    icon="⚖️"
                    title="身體狀態 (Status)"
                    formula="7日體重趨勢分析"
                    desc="單日的體重起伏充滿雜訊（水分、鹽分）。系統透過演算法分析過去 7 天的數據走向，告訴您真實的身體變化。"
                    source="來源：根據體重紀錄計算斜率。"
                />
            )
        }
    };

    const currentHelp = selectedHelp ? HELP_CONTENT[selectedHelp] : null;

    return (
        <>
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div onClick={() => setSelectedHelp('calories')} style={{ cursor: 'pointer' }}>
                    <BentoMetric
                        label="淨熱量"
                        icon={<span>🔥</span>}
                        value={caloriesVal !== null ? caloriesVal.toLocaleString() : '—'}
                        unit={caloriesVal !== null ? "kcal" : "尚未記錄"}
                        subtext="攝取 - 消耗"
                    />
                </div>
                <div onClick={() => setSelectedHelp('burn')} style={{ cursor: 'pointer' }}>
                    <BentoMetric
                        label="消耗"
                        icon={<span>⏱</span>}
                        value={burnVal !== null ? burnVal.toString() : '—'}
                        unit={burnVal !== null ? "kcal" : "尚未記錄"}
                        subtext="運動消耗"
                    />
                </div>
                <div onClick={() => setSelectedHelp('status')} style={{ cursor: 'pointer' }}>
                    <BentoMetric
                        label="狀態"
                        icon={<span>⚖️</span>}
                        value={currentStatus}
                        unit=""
                        subtext="7日趨勢"
                    />
                </div>
            </section>

            {/* Help Sheet */}
            <QuickAddSheet
                isOpen={!!selectedHelp}
                onClose={() => setSelectedHelp(null)}
                title={currentHelp?.title || '數據說明'}
            >
                <div style={{ paddingBottom: '2rem' }}>
                    {currentHelp?.item}
                </div>
            </QuickAddSheet>
        </>
    );
}

function HelpItem({ icon, title, formula, desc, source }: { icon: string, title: string, formula: string, desc: string, source: string }) {
    return (
        <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{
                fontSize: '1.5rem',
                background: 'var(--bg-app)',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
            }}>
                {icon}
            </div>
            <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {title}
                </h3>
                <div style={{
                    display: 'inline-block',
                    background: 'rgba(0,0,0,0.05)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.5rem'
                }}>
                    公式：{formula}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '0.5rem' }}>
                    {desc}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    {source}
                </p>
            </div>
        </div>
    );
}

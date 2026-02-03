'use client';

import React, { useState } from 'react';
import { QuickAddSheet } from '../components/QuickAddSheet';
import { TrendSparkline } from '../components/TrendSparkline';

interface BodyMetricsGridProps {
    weight: number | null;
    bmr: number | null;
    tdee: number | null;
    weightTrend: number[];
}

export function BodyMetricsGrid({ weight, bmr, tdee, weightTrend }: BodyMetricsGridProps) {
    const [selectedHelp, setSelectedHelp] = useState<'weight' | 'bmr' | 'tdee' | null>(null);

    const HELP_CONTENT = {
        weight: {
            title: '體重計量說明',
            item: (
                <HelpItem
                    icon="⚖️"
                    title="目前體重"
                    formula="每日早晨空腹測量"
                    desc="體重是反映身體總質量的指標。建議固定在每天早上起床、如廁後、吃早餐前測量，以減少水分與食物殘渣的干擾。"
                    source="建議頻率：每日記錄"
                />
            )
        },
        bmr: {
            title: '基礎代謝說明',
            item: (
                <HelpItem
                    icon="🔥"
                    title="基礎代謝率 (BMR)"
                    formula="Mifflin-St Jeor 公式"
                    desc="這是您整天躺著不動也會消耗的熱量，是維持心跳、呼吸、器官運作的最低需求。無論如何減重，飲食攝取絕對不能低於此數值，否則身體會進入節能模式，導致代謝受損。"
                    source="公式變數：身高、年齡、體重、性別"
                />
            )
        },
        tdee: {
            title: '總消耗說明',
            item: (
                <HelpItem
                    icon="⚡️"
                    title="每日總消耗 (TDEE)"
                    formula="BMR × 活動係數"
                    desc="包含基礎代謝加上您日常活動（工作、通勤、運動）所消耗的總熱量。若要減重，建議攝取量控制在 TDEE-300 到 TDEE-500 之間；若要增重則相反。"
                    source={bmr && tdee ? `您目前的活動係數估算為 ${(tdee / bmr).toFixed(2)}` : '完成更多紀錄後即可估算活動係數'}
                />
            )
        }
    };

    const currentHelp = selectedHelp ? HELP_CONTENT[selectedHelp] : null;

    return (
        <>
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>

                {/* Weight Card (Big) */}
                <div
                    onClick={() => setSelectedHelp('weight')}
                    style={{
                        gridColumn: '1 / -1',
                        background: 'var(--bg-card)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-soft)',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                        cursor: 'pointer',
                        transition: 'transform 0.1s'
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                            <span>⚖️</span>
                            <span>目前體重</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {weight ? weight : '--'}
                            </span>
                            <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>kg</span>
                        </div>
                    </div>
                    <div style={{ width: '120px', height: '60px', opacity: 0.8 }}>
                        <TrendSparkline data={weightTrend} height={50} color="var(--primary)" />
                    </div>
                </div>

                {/* BMR Card */}
                <div
                    onClick={() => setSelectedHelp('bmr')}
                    style={{
                        background: 'var(--bg-card)',
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-soft)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        cursor: 'pointer'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                        <span>🔥</span>
                        <span>基礎代謝 (BMR)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                        <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {bmr ? bmr : '--'}
                        </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        靜止消耗
                    </div>
                </div>

                {/* TDEE Card */}
                <div
                    onClick={() => setSelectedHelp('tdee')}
                    style={{
                        background: 'var(--bg-card)',
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-soft)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        cursor: 'pointer'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                        <span>⚡️</span>
                        <span>每日總消耗 (TDEE)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                        <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {tdee ? tdee : '--'}
                        </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        活動消耗估算
                    </div>
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

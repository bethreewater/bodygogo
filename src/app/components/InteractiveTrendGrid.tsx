'use client';

import React, { useState } from 'react';
import { TrendSparkline } from './TrendSparkline'; // Check path
import { QuickAddSheet } from './QuickAddSheet';

interface InteractiveTrendGridProps {
    trendCalories: number[];
    trendMinutes: number[];
}

export function InteractiveTrendGrid({ trendCalories, trendMinutes }: InteractiveTrendGridProps) {
    const [selectedHelp, setSelectedHelp] = useState<'calories' | 'minutes' | null>(null);

    const HELP_CONTENT = {
        calories: {
            title: '淨熱量趨勢',
            content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ fontSize: '3rem', textAlign: 'center' }}>📉</div>
                    <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        此圖表顯示過去 7 天的<strong>淨熱量</strong>變化。
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                        <li><strong>平穩</strong>：代表熱量攝取與消耗平衡，適合維持體重。</li>
                        <li><strong>下降</strong>：若是負值或持續走低，代表創造了熱量赤字，有助於減重。</li>
                        <li><strong>起伏</strong>：大幅震盪可能代表飲食不規律，建議保持穩定。</li>
                    </ul>
                    <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                        💡 <strong>小秘訣</strong>：保持趨勢在綠色區間（適度赤字）效果最好，過度節食反而會降低代謝喔！
                    </div>
                </div>
            )
        },
        minutes: {
            title: '活躍時長趨勢',
            content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ fontSize: '3rem', textAlign: 'center' }}>⏱</div>
                    <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        此圖表顯示過去 7 天的<strong>中高強度活動時間</strong>。
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                        <li><strong>WHO 建議</strong>：成人每週至少應累積 150 分鐘中等強度運動。</li>
                        <li><strong>規律性</strong>：每天 30 分鐘比週末一次運動 3 小時更有效。</li>
                    </ul>
                    <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                        💡 <strong>小秘訣</strong>：不一定要重訓才算，快走、爬樓梯、做家事只要心跳加快都算在內！
                    </div>
                </div>
            )
        }
    };

    const currentHelp = selectedHelp ? HELP_CONTENT[selectedHelp] : null;

    return (
        <>
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div
                    onClick={() => setSelectedHelp('calories')}
                    style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '1rem', boxShadow: 'var(--shadow-soft)', cursor: 'pointer' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>熱量趨勢</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>ⓘ</div>
                    </div>
                    <TrendSparkline data={trendCalories} height={40} color="var(--accent)" />
                </div>
                <div
                    onClick={() => setSelectedHelp('minutes')}
                    style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '1rem', boxShadow: 'var(--shadow-soft)', cursor: 'pointer' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>活躍時長</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>ⓘ</div>
                    </div>
                    <TrendSparkline data={trendMinutes} height={40} color="var(--accent)" />
                </div>
            </section>

            <QuickAddSheet
                isOpen={!!selectedHelp}
                onClose={() => setSelectedHelp(null)}
                title={currentHelp?.title || '數據說明'}
            >
                <div>
                    {currentHelp?.content}
                </div>
            </QuickAddSheet>
        </>
    );
}

'use client';

import React, { useState } from 'react';
import { QuickAddSheet } from './QuickAddSheet';

export function SystemHelpDisplay() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                aria-label="系統說明"
                style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-tertiary)',
                    fontSize: '1.25rem'
                }}
            >
                {/* Info Icon */}
                <span style={{
                    width: '24px',
                    height: '24px',
                    border: '2px solid currentColor',
                    borderRadius: '50%',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    ?
                </span>
            </button>

            <QuickAddSheet
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="數據說明書"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Item 1: Net Calories */}
                    <HelpItem
                        icon="🔥"
                        title="淨熱量 (Net Calories)"
                        formula="飲食攝取 - 運動消耗"
                        desc="這是體重控制最核心的數字。就像銀行帳戶一樣，我們關注的是「存下來」的熱量。"
                        source="來源：每日飲食紀錄減去運動消耗。"
                    />

                    {/* Item 2: Workout */}
                    <HelpItem
                        icon="⏱"
                        title="有效運動 (Workout)"
                        formula="中高強度活動累積"
                        desc="代表您今日投入健身、跑步或是高耗能活動的總時長。不僅是為了消耗熱量，更是為了提升代謝。"
                        source="來源：手動記錄的運動項目。"
                    />

                    {/* Item 3: Status */}
                    <HelpItem
                        icon="⚖️"
                        title="身體狀態 (Status)"
                        formula="7日體重趨勢分析"
                        desc="單日的體重起伏充滿雜訊（水分、鹽分）。系統透過演算法分析過去 7 天的數據走向，告訴您真實的身體變化。"
                        source="來源：根據體重紀錄計算斜率。"
                    />

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

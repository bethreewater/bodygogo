'use client';

import React from 'react';

interface DailySummaryBarProps {
    label: string;
    current: number;
    target?: number;
    unit: string;
    variant?: 'default' | 'danger' | 'success';
}

export function DailySummaryBar({ label, current, target, unit, variant = 'default' }: DailySummaryBarProps) {
    const remaining = target ? target - current : null;
    const percentage = target ? Math.min((current / target) * 100, 100) : 0;

    const variantColors = {
        default: 'var(--accent)',
        danger: 'var(--error)',
        success: 'var(--success)'
    };

    return (
        <div style={{
            position: 'sticky',
            top: 0,
            background: 'var(--bg-surface)',
            padding: '1.5rem 2rem',
            boxShadow: 'var(--shadow-soft)',
            zIndex: 50,
            backdropFilter: 'blur(20px)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {label}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {current.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {unit}
                    </span>
                    {target && (
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                            / {target.toLocaleString()}
                        </span>
                    )}
                </div>
            </div>

            {target && (
                <>
                    {/* Progress Bar */}
                    <div style={{
                        height: '4px',
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${percentage}%`,
                            background: variantColors[variant],
                            transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                        }} />
                    </div>

                    {/* Remaining Text */}
                    {remaining !== null && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                            {remaining > 0 ? `還剩 ${remaining.toLocaleString()} ${unit}` : '已達成目標'}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

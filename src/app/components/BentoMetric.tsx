'use client';

import React from 'react';

interface BentoMetricProps {
    label: string;
    value: string | number;
    unit?: string;
    subtext?: string;
    icon?: React.ReactNode;
    onInfoClick?: () => void;
}

export function BentoMetric({ label, value, unit, subtext, icon, onInfoClick }: BentoMetricProps) {
    return (
        <div style={{
            background: 'var(--bg-card)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-soft)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '120px',
            position: 'relative'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                    {icon}
                    <span>{label}</span>
                </div>
                {onInfoClick && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onInfoClick();
                        }}
                        aria-label="說明"
                        style={{
                            background: 'rgba(0,0,0,0.05)',
                            border: 'none',
                            color: 'var(--text-tertiary)',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            fontWeight: 700
                        }}
                    >
                        i
                    </button>
                )}
            </div>

            <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                    <span style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: 'var(--accent)',
                        letterSpacing: '-0.03em'
                    }}>
                        {value}
                    </span>
                    {unit && <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{unit}</span>}
                </div>
                {subtext && (
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {subtext}
                    </div>
                )}
            </div>
        </div>
    );
}

import React from 'react';

interface LevelProgressProps {
    level: number;
    currentXP: number;
    nextXP: number;
}

export function LevelProgress({ level, currentXP, nextXP }: LevelProgressProps) {
    const percentage = Math.min(100, Math.max(0, (currentXP / nextXP) * 100));

    return (
        <div style={{
            background: 'var(--bg-card)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-soft)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem' // Adjusted spacing
        }}>
            {/* Level Badge */}
            <div style={{
                background: 'linear-gradient(135deg, var(--accent) 0%, #F59E0B 100%)', // Gradient juice
                color: 'white',
                width: '48px',
                height: '48px',
                borderRadius: '16px', // Squircle
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.3)',
                flexShrink: 0
            }}>
                <span style={{ fontSize: '0.625rem', fontWeight: 600, opacity: 0.9 }}>LV</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1 }}>{level}</span>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                }}>
                    <span>冒險者等級</span>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>{currentXP} / {nextXP} XP</span>
                </div>

                {/* Progress Track */}
                <div style={{
                    height: '10px',
                    background: 'var(--bg-app)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.05)'
                }}>
                    {/* Progress Fill */}
                    <div style={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: 'linear-gradient(90deg, var(--accent) 0%, #F59E0B 100%)',
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' // Bouncy spring
                    }} />
                </div>
            </div>
        </div>
    );
}

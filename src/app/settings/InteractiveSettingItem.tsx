'use client';

import { useTransition } from 'react';

interface InteractiveSettingItemProps {
    label: string;
    value: string;
    description?: string;
    action: () => Promise<void>;
    style?: React.CSSProperties; // Add style support
}

export function InteractiveSettingItem({ label, value, description, action, style }: InteractiveSettingItemProps) {
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        startTransition(async () => {
            await action();
        });
    };

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            style={{
                background: 'var(--bg-card)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-soft)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                opacity: isPending ? 0.7 : 1,
                transition: 'transform 0.1s, opacity 0.2s',
                position: 'relative',
                overflow: 'hidden',
                ...style // Allow overrides
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.99)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '1rem' }}>{label}</span>
                {description && <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{description}</span>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>{value}</span>
                {/* Chevron or Icon to indicate clickability */}
                <span style={{ color: 'var(--text-tertiary)', fontSize: '1rem' }}>›</span>
            </div>

            {/* Loading Overlay */}
            {isPending && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(255,255,255,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--text-primary)'
                }}>
                    更新中...
                </div>
            )}
        </button>
    );
}

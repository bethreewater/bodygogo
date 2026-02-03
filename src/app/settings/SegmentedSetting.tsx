'use client';

{/* Reusable Segmented Control for Settings */ }
interface Option {
    label: string;
    value: string;
    action: () => void;
}

interface SegmentedSettingProps {
    label: string;
    description?: string;
    options: Option[];
    currentValue: string; // The value that matches the option.value to determine active state
}

export function SegmentedSetting({ label, description, options, currentValue }: SegmentedSettingProps) {
    return (
        <div style={{
            background: 'var(--bg-card)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-soft)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
        }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '1rem' }}>{label}</span>
                {description && <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{description}</span>}
            </div>

            <div style={{
                display: 'flex',
                background: 'var(--bg-app)', // Darker background for the track
                padding: '4px',
                borderRadius: 'var(--radius-md)',
            }}>
                {options.map((opt) => {
                    const isActive = opt.value === currentValue;
                    return (
                        <button
                            key={opt.value}
                            onClick={opt.action}
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                border: 'none',
                                background: isActive ? 'var(--bg-card)' : 'transparent',
                                boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                fontWeight: isActive ? 600 : 500,
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {opt.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

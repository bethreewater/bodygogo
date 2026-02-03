'use client';

interface ProgressBarProps {
    label: string;
    startValue: number;
    currentValue: number;
    targetValue: number;
    unit: string;
    color?: string;
}

/**
 * Dual Progress Bar - Visual progress from start to target
 * Shows current position and completion percentage
 */
export function ProgressBar({
    label,
    startValue,
    currentValue,
    targetValue,
    unit,
    color = 'var(--accent)',
}: ProgressBarProps) {
    // Calculate progress percentage
    const totalChange = Math.abs(targetValue - startValue);
    const currentChange = Math.abs(currentValue - startValue);
    const progressPercent = totalChange > 0 ? Math.min((currentChange / totalChange) * 100, 100) : 0;

    // Determine if goal is to increase or decrease
    const isDecreasing = targetValue < startValue;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
        }}>
            {/* Label and Percentage */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--text-tertiary)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                }}>
                    {label}
                </span>
                <span style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: color,
                }}>
                    {progressPercent.toFixed(0)}% 完成
                </span>
            </div>

            {/* Progress Bar Track */}
            <div style={{
                position: 'relative',
                height: '32px',
                background: 'rgba(0, 0, 0, 0.05)',
                borderRadius: '16px',
                overflow: 'visible',
                border: '1px solid rgba(0, 0, 0, 0.08)'
            }}>
                {/* Progress Fill */}
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${progressPercent}%`,
                    background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
                    borderRadius: '16px',
                    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: `0 2px 8px ${color}40`
                }} />

                {/* Current Position Marker */}
                <div style={{
                    position: 'absolute',
                    left: `${progressPercent}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'white',
                    border: `3px solid ${color}`,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    zIndex: 2,
                    transition: 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />

                {/* Start Label */}
                <div style={{
                    position: 'absolute',
                    left: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: progressPercent > 15 ? 'white' : 'var(--text-secondary)',
                    zIndex: 1,
                    transition: 'color 0.3s'
                }}>
                    {startValue.toFixed(1)}
                </div>

                {/* Target Label */}
                <div style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: progressPercent > 85 ? 'white' : 'var(--text-secondary)',
                    zIndex: 1,
                    transition: 'color 0.3s'
                }}>
                    {targetValue.toFixed(1)}
                </div>
            </div>

            {/* Current Value Display */}
            <div style={{
                textAlign: 'center',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)'
            }}>
                現在 <span style={{
                    fontWeight: 700,
                    color: color,
                    fontSize: '1rem'
                }}>
                    {currentValue.toFixed(1)} {unit}
                </span>
                {' '}
                {isDecreasing ? '←' : '→'}
                {' '}
                還需 <span style={{ fontWeight: 600 }}>
                    {Math.abs(targetValue - currentValue).toFixed(1)} {unit}
                </span>
            </div>
        </div>
    );
}

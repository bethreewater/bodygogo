'use client';

interface EmptyStateCardProps {
    icon: string;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyStateCard({ icon, title, description, actionLabel, onAction }: EmptyStateCardProps) {
    return (
        <div style={{
            background: 'var(--bg-surface)',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-soft)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '0.75rem'
        }}>
            <div style={{
                fontSize: '2.5rem',
                opacity: 0.6
            }}>
                {icon}
            </div>
            <h3 style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0
            }}>
                {title}
            </h3>
            <p style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: '1.4'
            }}>
                {description}
            </p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: 'var(--color-primary, #4F46E5)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}

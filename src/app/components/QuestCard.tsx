'use client';

interface QuestCardProps {
    title: string;
    description?: string; // New Prop
    xp: number;
    status: 'available' | 'completed' | 'unavailable';
}

export function QuestCard({ title, description, xp, status }: QuestCardProps) {
    const isCompleted = status === 'completed';

    return (
        <div style={{
            background: isCompleted ? 'rgba(0,0,0,0.02)' : 'var(--bg-card)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: isCompleted ? 'none' : 'var(--shadow-soft)',
            border: isCompleted ? '1px dashed var(--border-light)' : '1px solid transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.2s',
            opacity: isCompleted ? 0.7 : 1
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                {/* Checkbox / Status Icon */}
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isCompleted ? 'var(--accent)' : 'var(--bg-app)',
                    border: isCompleted ? 'none' : '2px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.875rem',
                    flexShrink: 0,
                    transition: 'all 0.2s'
                }}>
                    {isCompleted && '✓'}
                </div>

                {/* Text Group */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                            fontWeight: 600,
                            color: isCompleted ? 'var(--text-tertiary)' : 'var(--text-primary)',
                            textDecoration: isCompleted ? 'line-through' : 'none',
                            fontSize: '0.9375rem'
                        }}>
                            {title}
                        </span>
                        <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--accent)',
                            fontWeight: 600,
                            opacity: isCompleted ? 0 : 1
                        }}>
                            +{xp} XP
                        </span>
                    </div>

                    {description && (
                        <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)',
                            fontWeight: 400
                        }}>
                            {description}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

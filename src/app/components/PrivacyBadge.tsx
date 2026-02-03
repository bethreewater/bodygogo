'use client';

interface PrivacyBadgeProps {
    privacy: 'public' | 'private';
    withIcon?: boolean;
    className?: string;
    size?: 'sm' | 'md';
    labelOverride?: string;
    showTooltip?: boolean;
}

export function PrivacyBadge({
    privacy,
    withIcon = false,
    className,
    size = 'md',
    labelOverride,
    showTooltip = true
}: PrivacyBadgeProps) {
    const textClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-1';
    const label = labelOverride ?? (privacy === 'private' ? '私人模式' : '公開模式');
    const tooltip = privacy === 'private' ? '你不會出現在社群中' : '你會出現在社群中';
    return (
        <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span
                className={`${textClass} font-semibold rounded-full border`}
                style={{
                    background: privacy === 'private' ? 'rgba(100, 116, 139, 0.1)' : 'rgba(16, 185, 129, 0.12)',
                    color: privacy === 'private' ? 'var(--text-secondary)' : '#059669',
                    borderColor: privacy === 'private' ? 'rgba(100, 116, 139, 0.2)' : 'rgba(16, 185, 129, 0.25)'
                }}
                aria-label={`目前隱私狀態：${privacy === 'private' ? '私人' : '公開'}`}
                title={showTooltip ? tooltip : undefined}
            >
                {label}
            </span>
            {withIcon && (
                <span
                    className="text-[12px]"
                    title={showTooltip ? (privacy === 'private' ? '私人模式：不顯示在社群' : '公開模式：可被社群看到') : undefined}
                    aria-hidden="true"
                >
                    {privacy === 'private' ? '🔒' : '🌐'}
                </span>
            )}
        </span>
    );
}

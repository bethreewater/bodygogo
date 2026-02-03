'use client';

interface ToastProps {
    message: string;
    variant?: 'success' | 'info' | 'warning';
}

export function Toast({ message, variant = 'info' }: ToastProps) {
    const color =
        variant === 'success'
            ? { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.25)', text: '#059669' }
            : variant === 'warning'
                ? { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.25)', text: '#b45309' }
                : { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.25)', text: '#2563eb' };

    return (
        <div
            role="status"
            style={{
                fontSize: '0.75rem',
                color: color.text,
                background: color.bg,
                border: `1px solid ${color.border}`,
                padding: '0.4rem 0.6rem',
                borderRadius: '999px',
                width: 'fit-content'
            }}
        >
            {message}
        </div>
    );
}

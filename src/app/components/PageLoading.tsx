export function PageLoading({ title }: { title?: string }) {
    return (
        <div style={{
            maxWidth: '640px',
            margin: '0 auto',
            padding: '3rem 2rem',
            paddingBottom: '8rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            minHeight: '100vh',
            background: 'var(--bg-app)'
        }}>
            <div style={{ height: '28px', width: '45%', background: 'rgba(0,0,0,0.05)', borderRadius: '10px' }} />
            <div style={{ height: '14px', width: '60%', background: 'rgba(0,0,0,0.05)', borderRadius: '10px' }} />
            <div style={{ height: '180px', width: '100%', background: 'rgba(0,0,0,0.04)', borderRadius: '24px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ height: '120px', background: 'rgba(0,0,0,0.05)', borderRadius: '18px' }} />
                <div style={{ height: '120px', background: 'rgba(0,0,0,0.05)', borderRadius: '18px' }} />
            </div>
            <div style={{ height: '140px', background: 'rgba(0,0,0,0.04)', borderRadius: '20px' }} />
            {title && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>{title}</p>
            )}
        </div>
    );
}

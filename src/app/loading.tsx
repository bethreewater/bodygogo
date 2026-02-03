export default function Loading() {
    return (
        <div style={{
            maxWidth: '480px',
            margin: '0 auto',
            padding: '2rem 1.5rem',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            background: 'var(--bg-app)',
        }}>
            {/* Header Skeleton */}
            <div style={{ height: '60px', width: '60%', background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }} />

            {/* Level Skeleton */}
            <div style={{ height: '20px', width: '100%', background: 'rgba(0,0,0,0.05)', borderRadius: '99px' }} />

            {/* Hero Skeleton (Pixel Art Room) */}
            <div style={{ aspectRatio: '1/1', width: '100%', background: 'rgba(0,0,0,0.05)', borderRadius: '24px' }} />

            {/* Metrics Skeleton */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ height: '100px', background: 'rgba(0,0,0,0.05)', borderRadius: '16px' }} />
                <div style={{ height: '100px', background: 'rgba(0,0,0,0.05)', borderRadius: '16px' }} />
            </div>
        </div>
    );
}

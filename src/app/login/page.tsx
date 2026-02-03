import { AuthForm } from './AuthForm';

export default function LoginPage() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'var(--bg-app)',
            gap: '2rem'
        }}>
            {/* Logo / Branding */}
            <div style={{ textAlign: 'center', animation: 'fadeIn 0.8s ease-out' }}>
                <div style={{
                    fontSize: '4rem',
                    marginBottom: '1rem',
                    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                }}>
                    🕹️
                </div>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.03em'
                }}>
                    BodyGoGo
                </h1>
                <p style={{
                    fontSize: '1rem',
                    color: 'var(--text-tertiary)',
                    fontWeight: 500
                }}>
                    Algorithm-Centric Health Tracker
                </p>
            </div>

            <AuthForm />

            <div style={{
                marginTop: '2rem',
                fontSize: '0.75rem',
                color: 'var(--text-tertiary)',
                opacity: 0.5
            }}>
                v0.7.1 • Phase 71
            </div>
        </div>
    );
}

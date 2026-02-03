'use client';

import { useActionState, useState } from 'react';
import { login, signup } from '@/app/actions/auth';

export function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [loginState, loginAction, isLoginPending] = useActionState(login, null);
    const [signupState, signupAction, isSignupPending] = useActionState(signup, null);

    const toggleMode = () => {
        setIsLogin(!isLogin);
        // Reset states if needed, though they are separate
    };

    return (
        <div style={{
            background: 'var(--bg-card)',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-soft)',
            width: '100%',
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            animation: 'slideUp 0.5s ease-out'
        }}>
            <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    {isLogin ? '歡迎回來' : '建立帳號'}
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {isLogin ? '繼續您的健康旅程' : '開始您的冒險'}
                </p>
            </div>

            {isLogin ? (
                <form action={loginAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="hero@bodygogo.com"
                            style={{
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-light)',
                                background: 'var(--bg-app)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            style={{
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-light)',
                                background: 'var(--bg-app)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    {loginState?.error && (
                        <div style={{ padding: '0.75rem', background: '#FEE2E2', color: '#B91C1C', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
                            {loginState.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoginPending}
                        style={{
                            marginTop: '0.5rem',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-full)',
                            border: 'none',
                            background: 'var(--primary)',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '1rem',
                            cursor: isLoginPending ? 'not-allowed' : 'pointer',
                            opacity: isLoginPending ? 0.7 : 1,
                            transition: 'all 0.2s'
                        }}
                    >
                        {isLoginPending ? '登入中...' : '登入'}
                    </button>
                </form>
            ) : (
                <form action={signupAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="hero@bodygogo.com"
                            style={{
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-light)',
                                background: 'var(--bg-app)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            minLength={6}
                            style={{
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-light)',
                                background: 'var(--bg-app)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    {signupState?.error && (
                        <div style={{ padding: '0.75rem', background: '#FEE2E2', color: '#B91C1C', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
                            {signupState.error}
                        </div>
                    )}
                    {signupState?.success && (
                        <div style={{ padding: '0.75rem', background: '#DCFCE7', color: '#15803D', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
                            {signupState.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSignupPending}
                        style={{
                            marginTop: '0.5rem',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-full)',
                            border: 'none',
                            background: 'var(--accent)',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '1rem',
                            cursor: isSignupPending ? 'not-allowed' : 'pointer',
                            opacity: isSignupPending ? 0.7 : 1,
                            transition: 'all 0.2s'
                        }}
                    >
                        {isSignupPending ? '註冊中...' : '註冊帳號'}
                    </button>
                </form>
            )}

            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <button
                    onClick={toggleMode}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                    }}
                >
                    {isLogin ? '還沒有帳號？ 按此註冊' : '已經有帳號？ 按此登入'}
                </button>
            </div>
        </div>
    );
}

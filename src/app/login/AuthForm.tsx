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
        <div className="auth-card">
            <div className="auth-header">
                <div>
                    <h2>{isLogin ? '歡迎回來' : '建立帳號'}</h2>
                    <p>{isLogin ? '繼續您的健康旅程' : '開始您的冒險'}</p>
                </div>
                <div className="auth-tabs">
                    <button
                        type="button"
                        className={`auth-tab ${isLogin ? 'active' : ''}`}
                        aria-pressed={isLogin}
                        onClick={() => setIsLogin(true)}
                    >
                        登入
                    </button>
                    <button
                        type="button"
                        className={`auth-tab ${!isLogin ? 'active' : ''}`}
                        aria-pressed={!isLogin}
                        onClick={() => setIsLogin(false)}
                    >
                        註冊
                    </button>
                </div>
            </div>

            {isLogin ? (
                <form action={loginAction} className="auth-form">
                    <div className="auth-field">
                        <label>Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="hero@bodygogo.com"
                            className="auth-input"
                        />
                    </div>
                    <div className="auth-field">
                        <label>Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="auth-input"
                        />
                    </div>

                    {loginState?.error && (
                        <div className="auth-alert error">
                            {loginState.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoginPending}
                        className="auth-button primary"
                    >
                        {isLoginPending ? '登入中...' : '登入'}
                    </button>
                </form>
            ) : (
                <form action={signupAction} className="auth-form">
                    <div className="auth-field">
                        <label>Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="hero@bodygogo.com"
                            className="auth-input"
                        />
                    </div>
                    <div className="auth-field">
                        <label>Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            minLength={6}
                            className="auth-input"
                        />
                    </div>

                    {signupState?.error && (
                        <div className="auth-alert error">
                            {signupState.error}
                        </div>
                    )}
                    {signupState?.success && (
                        <div className="auth-alert success">
                            {signupState.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSignupPending}
                        className="auth-button accent"
                    >
                        {isSignupPending ? '註冊中...' : '註冊帳號'}
                    </button>
                </form>
            )}

            <div className="auth-footer">
                <button
                    onClick={toggleMode}
                    className="auth-toggle"
                >
                    {isLogin ? '還沒有帳號？ 按此註冊' : '已經有帳號？ 按此登入'}
                </button>
                <p className="auth-hint">登入或註冊代表你同意我們的資料與隱私規範。</p>
            </div>
        </div>
    );
}

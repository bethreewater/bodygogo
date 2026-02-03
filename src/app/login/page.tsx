import { AuthForm } from './AuthForm';

export default function LoginPage() {
    return (
        <div className="login-shell">
            <div className="login-grid">
                {/* Brand Panel */}
                <div className="login-brand">
                    <div className="login-brand-glow" />
                    <div className="login-brand-body">
                        <div className="login-brand-icon" aria-hidden="true">
                            <svg
                                width="64"
                                height="64"
                                viewBox="0 0 64 64"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <defs>
                                    <linearGradient id="inkFlow" x1="6" y1="12" x2="58" y2="52">
                                        <stop offset="0%" stopColor="rgba(245,241,232,0.7)" />
                                        <stop offset="45%" stopColor="rgba(245,241,232,0.45)" />
                                        <stop offset="100%" stopColor="rgba(245,241,232,0.2)" />
                                    </linearGradient>
                                </defs>
                                <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,0.08)" />
                                <path
                                    d="M6 36C18 26 30 24 42 28C50 31 56 32 60 30"
                                    stroke="url(#inkFlow)"
                                    strokeWidth="4.5"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M4 44C18 38 30 36 42 39C50 41 56 41 60 39"
                                    stroke="rgba(245,241,232,0.35)"
                                    strokeWidth="3.2"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M16 22C26 16 36 16 46 20"
                                    stroke="rgba(245,241,232,0.25)"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M22 20C26 12 34 10 40 16C44 20 44 26 40 30C36 34 30 34 26 30"
                                    stroke="rgba(245,241,232,0.85)"
                                    strokeWidth="3.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M28 28C30 36 36 40 44 42"
                                    stroke="rgba(245,241,232,0.8)"
                                    strokeWidth="3.2"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M24 30C18 36 14 42 12 48"
                                    stroke="rgba(245,241,232,0.7)"
                                    strokeWidth="3.2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                        <h1>BodyGoGo</h1>
                        <p>讓演算法成為你的健康隊友，精準追蹤、溫柔陪跑。</p>
                        <div className="login-brand-tags">
                            <span>v0.7.1</span>
                            <span>•</span>
                            <span>Phase 71</span>
                        </div>
                    </div>
                    <div className="login-brand-footer">
                        <div>
                            <span>每天一點點</span>
                            <strong> 都是進步</strong>
                        </div>
                        <span>Keep going, hero.</span>
                    </div>
                </div>

                {/* Auth Panel */}
                <div className="login-auth">
                    <AuthForm />
                </div>
            </div>
        </div>
    );
}

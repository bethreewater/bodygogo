'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type OnboardingStep = 1 | 2 | 3 | 4;

interface UserProfile {
    height: number | null;
    gender: 'male' | 'female' | null;
    birthYear: number | null;
    goal: 'lose' | 'gain' | 'maintain' | null;
    targetWeight: number | null;
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | null;
}

export default function InitPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
    const [profile, setProfile] = useState<UserProfile>({
        height: null,
        gender: null,
        birthYear: null,
        goal: null,
        targetWeight: null,
        activityLevel: null
    });

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep((prev) => (prev + 1) as OnboardingStep);
        } else {
            // Save profile (TODO: integrate with backend)
            console.log('Profile completed:', profile);
            router.push('/');
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as OnboardingStep);
        }
    };

    const updateProfile = (updates: Partial<UserProfile>) => {
        setProfile(prev => ({ ...prev, ...updates }));
    };

    const isStepComplete = () => {
        switch (currentStep) {
            case 1:
                return profile.height && profile.gender && profile.birthYear;
            case 2:
                return profile.goal && profile.targetWeight;
            case 3:
                return profile.activityLevel;
            case 4:
                return true;
            default:
                return false;
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-app)'
        }}>
            {/* Progress Bar */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'var(--bg-card)',
                zIndex: 100
            }}>
                <div style={{
                    height: '100%',
                    width: `${(currentStep / 4) * 100}%`,
                    background: 'var(--accent)',
                    transition: 'width 0.3s ease'
                }} />
            </div>

            {/* Main Content */}
            <div style={{
                flex: 1,
                maxWidth: '560px',
                margin: '0 auto',
                padding: '4rem 2rem',
                width: '100%'
            }}>
                {/* Step Content */}
                {currentStep === 1 && (
                    <Step1
                        profile={profile}
                        updateProfile={updateProfile}
                    />
                )}
                {currentStep === 2 && (
                    <Step2
                        profile={profile}
                        updateProfile={updateProfile}
                    />
                )}
                {currentStep === 3 && (
                    <Step3
                        profile={profile}
                        updateProfile={updateProfile}
                    />
                )}
                {currentStep === 4 && (
                    <Step4 profile={profile} />
                )}
            </div>

            {/* Navigation Buttons */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'var(--bg-surface)',
                padding: '1.5rem 2rem',
                borderTop: '1px solid var(--glass-border)',
                display: 'flex',
                gap: '1rem',
                justifyContent: 'space-between'
            }}>
                {currentStep > 1 && (
                    <button
                        onClick={handleBack}
                        style={{
                            padding: '1rem 2rem',
                            background: 'transparent',
                            border: '1px solid var(--text-tertiary)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-secondary)',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        上一步
                    </button>
                )}
                <button
                    onClick={handleNext}
                    disabled={!isStepComplete()}
                    style={{
                        flex: currentStep === 1 ? 1 : 0,
                        marginLeft: currentStep === 1 ? 0 : 'auto',
                        padding: '1rem 2rem',
                        background: isStepComplete() ? 'var(--accent)' : 'var(--bg-card)',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        color: isStepComplete() ? 'var(--bg-app)' : 'var(--text-tertiary)',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: isStepComplete() ? 'pointer' : 'not-allowed',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {currentStep === 4 ? '開始使用' : '下一步'}
                </button>
            </div>
        </div>
    );
}

// Step Components
function Step1({ profile, updateProfile }: { profile: UserProfile; updateProfile: (updates: Partial<UserProfile>) => void }) {
    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                基本資料
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: '1.6' }}>
                讓我們了解您的基本狀況
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
                        身高 (cm)
                    </label>
                    <input
                        type="number"
                        value={profile.height || ''}
                        onChange={(e) => updateProfile({ height: parseInt(e.target.value) || null })}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: 'var(--bg-card)',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            fontSize: '1rem'
                        }}
                        placeholder="170"
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
                        性別
                    </label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {(['male', 'female'] as const).map((gender) => (
                            <button
                                key={gender}
                                onClick={() => updateProfile({ gender })}
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    background: profile.gender === gender ? 'var(--accent-glow)' : 'var(--bg-card)',
                                    border: profile.gender === gender ? '2px solid var(--accent)' : 'none',
                                    borderRadius: 'var(--radius-md)',
                                    color: profile.gender === gender ? 'var(--accent)' : 'var(--text-primary)',
                                    fontSize: '1rem',
                                    cursor: 'pointer'
                                }}
                            >
                                {gender === 'male' ? '男性' : '女性'}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
                        出生年份
                    </label>
                    <input
                        type="number"
                        value={profile.birthYear || ''}
                        onChange={(e) => updateProfile({ birthYear: parseInt(e.target.value) || null })}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: 'var(--bg-card)',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            fontSize: '1rem'
                        }}
                        placeholder="1990"
                    />
                </div>
            </div>
        </div>
    );
}

function Step2({ profile, updateProfile }: { profile: UserProfile; updateProfile: (updates: Partial<UserProfile>) => void }) {
    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                您的目標
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: '1.6' }}>
                選擇您想要達成的目標
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
                        目標類型
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {([
                            { value: 'lose', label: '減脂' },
                            { value: 'gain', label: '增肌' },
                            { value: 'maintain', label: '維持' }
                        ] as const).map((option) => (
                            <button
                                key={option.value}
                                onClick={() => updateProfile({ goal: option.value })}
                                style={{
                                    padding: '1rem',
                                    background: profile.goal === option.value ? 'var(--accent-glow)' : 'var(--bg-card)',
                                    border: profile.goal === option.value ? '2px solid var(--accent)' : 'none',
                                    borderRadius: 'var(--radius-md)',
                                    color: profile.goal === option.value ? 'var(--accent)' : 'var(--text-primary)',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    textAlign: 'left'
                                }}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
                        目標體重 (kg)
                    </label>
                    <input
                        type="number"
                        value={profile.targetWeight || ''}
                        onChange={(e) => updateProfile({ targetWeight: parseFloat(e.target.value) || null })}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: 'var(--bg-card)',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)',
                            fontSize: '1rem'
                        }}
                        placeholder="65"
                    />
                </div>
            </div>
        </div>
    );
}

function Step3({ profile, updateProfile }: { profile: UserProfile; updateProfile: (updates: Partial<UserProfile>) => void }) {
    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                活動量
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: '1.6' }}>
                您平時的活動程度
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {([
                    { value: 'sedentary', label: '久坐', desc: '很少運動' },
                    { value: 'light', label: '輕度活動', desc: '每週運動 1-3 次' },
                    { value: 'moderate', label: '中度活動', desc: '每週運動 3-5 次' },
                    { value: 'active', label: '高度活動', desc: '每週運動 6-7 次' }
                ] as const).map((option) => (
                    <button
                        key={option.value}
                        onClick={() => updateProfile({ activityLevel: option.value })}
                        style={{
                            padding: '1.25rem',
                            background: profile.activityLevel === option.value ? 'var(--accent-glow)' : 'var(--bg-card)',
                            border: profile.activityLevel === option.value ? '2px solid var(--accent)' : 'none',
                            borderRadius: 'var(--radius-md)',
                            color: profile.activityLevel === option.value ? 'var(--accent)' : 'var(--text-primary)',
                            cursor: 'pointer',
                            textAlign: 'left'
                        }}
                    >
                        <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                            {option.label}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {option.desc}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

function Step4({ profile }: { profile: UserProfile }) {
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✨</div>
            <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                準備就緒
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: '1.6' }}>
                您的個人健康助手已經設定完成
            </p>

            <div style={{
                background: 'var(--bg-card)',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'left'
            }}>
                <h3 style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    您的資料
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>身高</span>
                        <span style={{ color: 'var(--text-primary)' }}>{profile.height} cm</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>性別</span>
                        <span style={{ color: 'var(--text-primary)' }}>{profile.gender === 'male' ? '男性' : '女性'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>目標</span>
                        <span style={{ color: 'var(--text-primary)' }}>
                            {profile.goal === 'lose' ? '減脂' : profile.goal === 'gain' ? '增肌' : '維持'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>目標體重</span>
                        <span style={{ color: 'var(--text-primary)' }}>{profile.targetWeight} kg</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

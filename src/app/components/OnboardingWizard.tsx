'use client';
/* eslint-disable @next/next/no-img-element */

import { useActionState, useState, useEffect } from 'react';
import { completeOnboarding } from '@/app/actions/onboarding';

export function OnboardingWizard() {
    const [page, setPage] = useState(1);
    const [state, action, isPending] = useActionState(completeOnboarding, null);

    // Success Handler
    useEffect(() => {
        if (state?.success) {
            // Force reload to ensure Brain re-calcs new profile and quests
            window.location.reload();
        }
    }, [state]);

    // UI States (Controlled)
    const [sex, setSex] = useState<'male' | 'female'>('male');
    const [birthDate, setBirthDate] = useState('1995-01-01');
    const [height, setHeight] = useState('');

    const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain');
    const [activity, setActivity] = useState<'sedentary' | 'light' | 'moderate' | 'active'>('moderate');

    const [weight, setWeight] = useState('');
    const [bodyFat, setBodyFat] = useState(''); // New State
    const [targetWeight, setTargetWeight] = useState('');
    const [targetBodyFat, setTargetBodyFat] = useState('');

    const bmrDisplay = '—';
    const tdeeDisplay = '—';

    // Validation & Navigation
    const [inlineError, setInlineError] = useState<string | null>(null);

    const nextPage = () => {
        setInlineError(null);
        if (page === 1) {
            if (!height || parseInt(height) < 50 || parseInt(height) > 250) {
                setInlineError('請輸入有效的身高 (50-250cm)');
                return;
            }
            if (!birthDate) return;
        }
        if (page === 3 && !weight) return;
        setPage(p => p + 1);
    };

    const prevPage = () => setPage(p => p - 1);

    const recommendationText = goal === 'lose'
        ? '完成設定後，系統將根據您的紀錄計算合適的熱量赤字。'
        : goal === 'gain'
            ? '完成設定後，系統將根據您的紀錄計算合適的熱量盈餘。'
            : '完成設定後，系統將根據您的紀錄提供維持體重的建議。';

    return (
        <div className="wizard-overlay">
            <style jsx global>{`
                .wizard-overlay {
                    position: fixed; inset: 0;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(8px);
                    z-index: 9999;
                    display: flex; align-items: center; justify-content: center;
                    padding: 1rem;
                }
                .wizard-card {
                    background: #ffffff;
                    width: 100%; max-width: 480px;
                    border-radius: 20px;
                    box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.18);
                    overflow: hidden;
                    display: flex; flex-direction: column;
                    position: relative;
                    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    max-height: 90vh;
                }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

                .wiz-header { padding: 2rem 2rem 0 2rem; text-align: center; flex-shrink: 0; }
                .wiz-title { font-size: 1.5rem; font-weight: 700; color: #111; margin-bottom: 0.5rem; letter-spacing: -0.02em; }
                .wiz-subtitle { color: #666; font-size: 0.95rem; line-height: 1.5; }

                .wiz-body { padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; overflow-y: auto; }

                .wiz-label { font-size: 0.9rem; font-weight: 600; color: #333; margin-bottom: 0.5rem; display: block; }
                .wiz-input { width: 100%; padding: 0.875rem; font-size: 1rem; border: 1px solid #e5e5e5; border-radius: 12px; background: #f9f9f9; transition: all 0.2s; outline: none; }
                .wiz-input:focus { background: #fff; border-color: #000; box-shadow: 0 0 0 2px rgba(0,0,0,0.05); }

                .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .grid-1 { display: grid; gap: 0.75rem; }

                .select-card { padding: 1rem; border: 1px solid #e5e5e5; border-radius: 12px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; background: #fff; color: #333; }
                .select-card:hover { background: #f5f5f5; }
                .select-card.active { border-color: #000; background: #111; color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
                .select-card-row { justify-content: flex-start; text-align: left; }
                
                @media (max-width: 400px) {
                    .grid-2 { grid-template-columns: 1fr; }
                    .wizard-card { border-radius: 16px; }
                    .wiz-body { padding: 1.5rem; }
                    .wiz-title { font-size: 1.25rem; }
                }

                .wiz-footer { padding: 1rem 2rem 2rem 2rem; display: flex; gap: 1rem; border-top: 1px solid #f5f5f5; flex-shrink: 0; }
                .btn { padding: 1rem; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; font-size: 1rem; }
                .btn-primary { flex: 1; background: #000; color: #fff; }
                .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
                .btn-secondary { background: transparent; color: #666; width: auto; padding-left: 0; padding-right: 0; }
                .btn-secondary:hover { color: #000; }
                
                .progress-dots { display: flex; justify-content: center; gap: 6px; margin-bottom: 1.5rem; }
                .dot { width: 8px; height: 8px; border-radius: 50%; background: #eee; transition: all 0.3s; }
                .dot.active { background: #000; width: 24px; border-radius: 4px; }
            `}</style>

            <form action={action} className="wizard-card">

                <input type="hidden" name="sex" value={sex} />
                <input type="hidden" name="birth_date" value={birthDate} />
                <input type="hidden" name="height" value={height} />
                <input type="hidden" name="goal" value={goal} />
                <input type="hidden" name="activity_level" value={activity} />
                <input type="hidden" name="weight" value={weight} />
                <input type="hidden" name="body_fat" value={bodyFat} /> {/* Hidden Input */}
                <input type="hidden" name="target_weight" value={targetWeight} />
                <input type="hidden" name="target_body_fat" value={targetBodyFat} />

                {/* HEADER */}
                <div className="wiz-header">
                    <div className="progress-dots">
                        <div className={`dot ${page >= 1 ? 'active' : ''}`} />
                        <div className={`dot ${page >= 2 ? 'active' : ''}`} />
                        <div className={`dot ${page >= 3 ? 'active' : ''}`} />
                        <div className={`dot ${page === 4 ? 'active' : ''}`} />
                    </div>

                    <h2 className="wiz-title">
                        {page === 1 ? '基本資料' : page === 2 ? '設定目標' : page === 3 ? '目前狀態' : '您的計畫'}
                    </h2>
                    <p className="wiz-subtitle">
                        {page === 1 ? '您的生理資訊將幫助我們計算基礎代謝。' : page === 2 ? '選擇一個適合您目前的健體目標。' : page === 3 ? '這將是您旅程的基準點。' : '根據您的數據，我們為您制定的建議。'}
                    </p>
                </div>

                {/* BODY */}
                <div className="wiz-body">

                    {page === 1 && (
                        <>
                            <div>
                                <label className="wiz-label">生理性別</label>
                                <div className="grid-2">
                                    <div className={`select-card ${sex === 'male' ? 'active' : ''}`} onClick={() => setSex('male')}>
                                        <span>男性</span>
                                    </div>
                                    <div className={`select-card ${sex === 'female' ? 'active' : ''}`} onClick={() => setSex('female')}>
                                        <span>女性</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="wiz-label">出生日期</label>
                                <input
                                    className="wiz-input"
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    max="2020-01-01"
                                />
                            </div>

                            <div>
                                <label className="wiz-label">身高 (cm)</label>
                                <input
                                    className="wiz-input"
                                    type="number"
                                    placeholder="例如：175"
                                    min={50} max={250}
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                />
                                {inlineError && <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', fontWeight: 600 }}>{inlineError}</div>}
                            </div>
                        </>
                    )}

                    {page === 2 && (
                        <>
                            <div>
                                <label className="wiz-label">目前的目標</label>
                                <div className="grid-1">
                                    <div className={`select-card select-card-row ${goal === 'lose' ? 'active' : ''}`} onClick={() => setGoal('lose')}>
                                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '0 0.5rem' }}>
                                            <span style={{ fontSize: '1.2rem', marginRight: '1rem' }}>🔥</span>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 600 }}>減重 (Lose)</span>
                                                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>熱量赤字</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`select-card select-card-row ${goal === 'maintain' ? 'active' : ''}`} onClick={() => setGoal('maintain')}>
                                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '0 0.5rem' }}>
                                            <span style={{ fontSize: '1.2rem', marginRight: '1rem' }}>⚖️</span>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 600 }}>維持 (Maintain)</span>
                                                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>保持平衡</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`select-card select-card-row ${goal === 'gain' ? 'active' : ''}`} onClick={() => setGoal('gain')}>
                                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '0 0.5rem' }}>
                                            <span style={{ fontSize: '1.2rem', marginRight: '1rem' }}>💪</span>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 600 }}>增肌 (Gain)</span>
                                                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>熱量盈餘</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="wiz-label">日常活動量</label>
                                <div className="grid-1">
                                    {([
                                        { val: 'sedentary', label: '久坐少動', desc: '辦公室工作，幾乎不運動' },
                                        { val: 'light', label: '輕度活動', desc: '每週運動 1-3 天' },
                                        { val: 'moderate', label: '中度活動', desc: '每週運動 3-5 天' },
                                        { val: 'active', label: '高度活動', desc: '每週運動 6-7 天 或 體力工作' }
                                    ] as const).map((item) => (
                                        <div
                                            key={item.val}
                                            className={`select-card select-card-row ${activity === item.val ? 'active' : ''}`}
                                            onClick={() => setActivity(item.val)}
                                        >
                                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '0 0.5rem' }}>
                                                <span style={{ fontWeight: 600 }}>{item.label}</span>
                                                <span style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '2px' }}>{item.desc}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {page === 3 && (
                        <>
                            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                <label className="wiz-label" style={{ marginBottom: '1rem' }}>輸入您的體重</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    placeholder="0.0"
                                    autoFocus
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    style={{
                                        fontSize: '4rem', fontWeight: 800, textAlign: 'center',
                                        border: 'none', borderBottom: '2px solid #000',
                                        width: '200px', background: 'transparent', outline: 'none',
                                        color: '#000', fontFamily: 'inherit'
                                    }}
                                />
                                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#999', marginTop: '1rem' }}>kg</div>

                            </div>


                            {/* Body Fat Input (Optional) */}
                            <div style={{ textAlign: 'center', marginTop: '1rem', borderTop: '1px solid #f0f0f0', paddingTop: '1.5rem' }}>
                                <label className="wiz-label" style={{ marginBottom: '0.75rem' }}>
                                    體脂率 (%) <span style={{ fontSize: '0.8em', fontWeight: 400, color: '#999' }}>(選填)</span>
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="-"
                                        value={bodyFat}
                                        onChange={(e) => setBodyFat(e.target.value)}
                                        style={{
                                            fontSize: '2rem', fontWeight: 700, textAlign: 'center',
                                            border: 'none', borderBottom: '2px solid #ddd',
                                            width: '120px', background: 'transparent', outline: 'none',
                                            color: '#333', fontFamily: 'inherit'
                                        }}
                                    />
                                    <span style={{ fontSize: '1rem', fontWeight: 600, color: '#999' }}>%</span>
                                </div>
                            </div>
                        </>
                    )}

                    {page === 4 && (
                        <>
                            {/* Stats Card */}
                            <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>基礎代謝 (BMR)</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{bmrDisplay}</div>
                                </div>
                                <div style={{ textAlign: 'center', borderLeft: '1px solid #eee' }}>
                                    <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>每日消耗 (TDEE)</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{tdeeDisplay}</div>
                                </div>
                            </div>

                            {/* Target Input */}
                            <div>
                                <label className="wiz-label">您的目標體重</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        className="wiz-input"
                                        type="number"
                                        step="0.1"
                                        placeholder={weight} // Use current weight as hint
                                        value={targetWeight}
                                        onChange={(e) => setTargetWeight(e.target.value)}
                                        style={{ fontSize: '1.25rem', fontWeight: 600 }}
                                    />
                                    <span style={{ fontWeight: 600, color: '#666' }}>kg</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                                    {goal === 'lose' && Number(targetWeight) > Number(weight) && '⚠️ 您選擇了減重，但目標體重高於目前體重'}
                                    {goal === 'gain' && Number(targetWeight) < Number(weight) && '⚠️ 您選擇了增肌，但目標體重低於目前體重'}
                                </div>
                            </div>

                            {/* Body Fat Target */}
                            <div style={{ marginTop: '0.5rem' }}>
                                <label className="wiz-label">目標體脂率 (%) <span style={{ fontSize: '0.8em', fontWeight: 400, color: '#999' }}>(選填)</span></label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        className="wiz-input"
                                        type="number"
                                        step="0.1"
                                        placeholder="例如: 20"
                                        value={targetBodyFat}
                                        onChange={(e) => setTargetBodyFat(e.target.value)}
                                        style={{ fontSize: '1.25rem', fontWeight: 600 }}
                                    />
                                    <span style={{ fontWeight: 600, color: '#666' }}>%</span>
                                </div>
                                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                                    <img
                                        src={sex === 'male' ? '/images/guide-bodyfat-male.png' : '/images/guide-bodyfat-female.png'}
                                        alt="Body Fat Guide"
                                        style={{ maxWidth: '100%', borderRadius: '12px', border: '1px solid #eee' }}
                                    />
                                    <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>
                                        參考圖示：不同體脂率的體態差異
                                    </div>
                                </div>
                            </div>

                            {/* Recommendation Card */}
                            <div style={{ background: '#eef2ff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #dbeafe' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: '#4f46e5', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                    AI 建議計畫
                                </label>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#312e81' }}>完成後自動計算</span>
                                    <span style={{ fontSize: '0.9rem', color: '#4338ca', fontWeight: 600 }}>kcal / 天</span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: '#4338ca', opacity: 0.8 }}>
                                    {recommendationText}
                                </p>
                            </div>

                            {state?.error && <div style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center' }}>{state.error}</div>}
                        </>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="wiz-footer">
                    {page > 1 && (
                        <button type="button" onClick={prevPage} className="btn btn-secondary">返回</button>
                    )}
                    {page < 4 ? (
                        <button type="button" onClick={nextPage} className="btn btn-primary">下一步</button>
                    ) : (
                        <button type="submit" disabled={isPending || !targetWeight} className="btn btn-primary">
                            {isPending ? '建立中...' : '開始旅程'}
                        </button>
                    )}
                </div>

            </form>
        </div>
    );
}

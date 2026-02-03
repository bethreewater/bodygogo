'use client';

import { useState } from 'react';
import { GoalProjection } from '@/lib/core/types';
import { ProgressBar } from './ProgressBar';
import { MiniTrendChart } from './MiniTrendChart';

interface GoalTimelineCardProps {
    projection: GoalProjection;
}

/**
 * Goal Timeline Card
 * 
 * Displays the projected timeline for reaching weight goal based on safe calorie deficit.
 */
export function GoalTimelineCard({ projection }: GoalTimelineCardProps) {
    const [showExplanation, setShowExplanation] = useState(false);

    const {
        days_to_goal,
        target_date,
        daily_deficit,
        min_intake_floor,
        tdee,
        is_achievable,
        warning
    } = projection;

    // Format target date for display
    const formattedDate = new Date(target_date).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <section>
            <h3 style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--text-tertiary)',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                目標達成時間線
                <button
                    onClick={() => setShowExplanation(true)}
                    style={{
                        background: 'linear-gradient(135deg, var(--accent) 0%, #6a9c7a 100%)',
                        border: 'none',
                        cursor: 'pointer',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    }}
                    aria-label="查看計算說明"
                >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <text x="6" y="9.5" fontSize="10" fontWeight="600" fill="white" textAnchor="middle">i</text>
                    </svg>
                </button>
            </h3>

            <div style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-soft)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
            }}>
                {/* Main Timeline */}
                {is_achievable ? (
                    <>
                        {/* Target Date */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            paddingBottom: '1rem',
                            borderBottom: '1px solid rgba(0,0,0,0.1)'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, var(--accent) 0%, #6a9c7a 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(127, 160, 133, 0.3)'
                            }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="3" y="6" width="18" height="15" rx="2" stroke="white" strokeWidth="2" fill="none" />
                                    <line x1="3" y1="10" x2="21" y2="10" stroke="white" strokeWidth="2" />
                                    <line x1="8" y1="3" x2="8" y2="7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="16" y1="3" x2="16" y2="7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-tertiary)',
                                    marginBottom: '0.25rem'
                                }}>
                                    預計達成日期
                                </div>
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    color: 'var(--accent)',
                                    lineHeight: 1.2
                                }}>
                                    {formattedDate}
                                </div>
                            </div>
                        </div>

                        {/* Progress Tracking */}
                        {(projection.start_weight || projection.start_body_fat || projection.target_body_fat) && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1rem',
                                paddingTop: '1rem',
                                borderTop: '1px solid rgba(0,0,0,0.1)'
                            }}>
                                {/* Weight Progress */}
                                <div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--text-tertiary)',
                                        marginBottom: '0.5rem',
                                        fontWeight: 600,
                                        letterSpacing: '0.05em',
                                        textTransform: 'uppercase'
                                    }}>
                                        體重進度
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.25rem'
                                    }}>
                                        {projection.start_weight && (
                                            <div style={{
                                                fontSize: '0.875rem',
                                                color: 'var(--text-secondary)',
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            }}>
                                                <span>起始</span>
                                                <span style={{ fontWeight: 600 }}>{projection.start_weight.toFixed(1)} kg</span>
                                            </div>
                                        )}
                                        <div style={{
                                            fontSize: '0.875rem',
                                            color: 'var(--text-primary)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontWeight: 600
                                        }}>
                                            <span>現在</span>
                                            <span style={{ color: 'var(--accent)' }}>{projection.current_weight.toFixed(1)} kg</span>
                                        </div>
                                        <div style={{
                                            fontSize: '0.875rem',
                                            color: 'var(--text-secondary)',
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>
                                            <span>目標</span>
                                            <span style={{ fontWeight: 600 }}>{projection.target_weight.toFixed(1)} kg</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Body Fat Progress */}
                                {(projection.start_body_fat || projection.current_body_fat || projection.target_body_fat) && (
                                    <div>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-tertiary)',
                                            marginBottom: '0.5rem',
                                            fontWeight: 600,
                                            letterSpacing: '0.05em',
                                            textTransform: 'uppercase'
                                        }}>
                                            體脂進度
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.25rem'
                                        }}>
                                            {projection.start_body_fat != null && (
                                                <div style={{
                                                    fontSize: '0.875rem',
                                                    color: 'var(--text-secondary)',
                                                    display: 'flex',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <span>起始</span>
                                                    <span style={{ fontWeight: 600 }}>{projection.start_body_fat.toFixed(1)}%</span>
                                                </div>
                                            )}
                                            {projection.current_body_fat != null && (
                                                <div style={{
                                                    fontSize: '0.875rem',
                                                    color: 'var(--text-primary)',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    fontWeight: 600
                                                }}>
                                                    <span>現在</span>
                                                    <span style={{ color: 'var(--accent)' }}>{projection.current_body_fat.toFixed(1)}%</span>
                                                </div>
                                            )}
                                            {projection.target_body_fat != null && (
                                                <div style={{
                                                    fontSize: '0.875rem',
                                                    color: 'var(--text-secondary)',
                                                    display: 'flex',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <span>目標</span>
                                                    <span style={{ fontWeight: 600 }}>{projection.target_body_fat.toFixed(1)}%</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Progress Visualizations */}
                        {is_achievable && (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2rem',
                                paddingTop: '1.5rem',
                                borderTop: '2px solid rgba(0, 0, 0, 0.08)'
                            }}>
                                {/* Section Title */}
                                <div style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 700,
                                    color: 'var(--text-primary)',
                                    letterSpacing: '0.02em'
                                }}>
                                    📊 進度可視化
                                </div>

                                {/* Progress Bars */}
                                {projection.start_weight && (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1.5rem'
                                    }}>
                                        {/* Weight Progress Bar */}
                                        <ProgressBar
                                            label="體重"
                                            startValue={projection.start_weight}
                                            currentValue={projection.current_weight}
                                            targetValue={projection.target_weight}
                                            unit="kg"
                                            color="var(--accent)"
                                        />

                                        {/* Body Fat Progress Bar */}
                                        {projection.start_body_fat && projection.current_body_fat && projection.target_body_fat && (
                                            <ProgressBar
                                                label="體脂"
                                                startValue={projection.start_body_fat}
                                                currentValue={projection.current_body_fat}
                                                targetValue={projection.target_body_fat}
                                                unit="%"
                                                color="#f093fb"
                                            />
                                        )}
                                    </div>
                                )}

                                {/* Trend Charts */}
                                {(projection.weight_history || projection.body_fat_history) && (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: projection.body_fat_history ? '1fr 1fr' : '1fr',
                                        gap: '1rem'
                                    }}>
                                        {/* Weight Trend Chart */}
                                        {projection.weight_history && projection.weight_history.length > 1 && (
                                            <MiniTrendChart
                                                data={projection.weight_history}
                                                targetValue={projection.target_weight}
                                                label="體重"
                                                color="var(--accent)"
                                            />
                                        )}

                                        {/* Body Fat Trend Chart */}
                                        {projection.body_fat_history && projection.body_fat_history.length > 1 && projection.current_body_fat && (
                                            <MiniTrendChart
                                                data={projection.body_fat_history}
                                                targetValue={projection.target_body_fat || projection.current_body_fat}
                                                label="體脂"
                                                color="#f093fb"
                                            />
                                        )}
                                    </div>
                                )}

                                {/* No data message */}
                                {!projection.start_weight && !projection.weight_history && (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '2rem',
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.875rem'
                                    }}>
                                        繼續記錄體重數據，即可看到進度視覺化 📈
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Days Remaining */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '1rem'
                        }}>
                            <MetricBox
                                icon="⏱️"
                                label="所需天數"
                                value={days_to_goal.toString()}
                                unit="天"
                            />
                            <MetricBox
                                icon="🔥"
                                label="每日建議缺口"
                                value={daily_deficit.toString()}
                                unit="kcal"
                            />
                        </div>

                        {/* Safety Info */}
                        <div style={{
                            background: 'rgba(127, 160, 133, 0.1)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                        }}>
                            <div style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: 'var(--accent)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <div style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '4px',
                                    background: 'var(--accent)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L4 6V11C4 16 7.5 20.5 12 22C16.5 20.5 20 16 20 11V6L12 2Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                安全建議
                            </div>
                            <div style={{
                                fontSize: '0.8rem',
                                color: 'var(--text-secondary)',
                                lineHeight: 1.5
                            }}>
                                每日最低攝入：<strong>{min_intake_floor} kcal</strong> (基於去脂體重)
                                <br />
                                每日總消耗 (TDEE)：<strong>{tdee} kcal</strong>
                            </div>
                        </div>

                        {/* Warning */}
                        {warning && (
                            <div style={{
                                background: 'rgba(255, 105, 97, 0.1)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '0.875rem',
                                fontSize: '0.8rem',
                                color: '#d63031',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '0.5rem'
                            }}>
                                <div style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '4px',
                                    background: '#d63031',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 8V13M12 16H12.01M12 2L3 20H21L12 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <span>{warning}</span>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem 1rem',
                        color: 'var(--text-secondary)'
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'rgba(255, 105, 97, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem'
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="#d63031" strokeWidth="2" />
                                <line x1="7" y1="7" x2="17" y2="17" stroke="#d63031" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                            無法安全達成目標
                        </div>
                        <div style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                            {warning || '您的 TDEE 低於安全攝入下限，無法創造熱量缺口。建議增加活動量。'}
                        </div>
                    </div>
                )}
            </div>

            {/* Explanation Modal */}
            {showExplanation && (
                <div
                    onClick={() => setShowExplanation(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '1rem'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'var(--bg-card)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '2rem',
                            maxWidth: '500px',
                            width: '100%',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1.5rem'
                        }}>
                            <h4 style={{
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '6px',
                                    background: 'linear-gradient(135deg, var(--accent) 0%, #6a9c7a 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="2.5" />
                                        <line x1="7" y1="12" x2="17" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                        <line x1="12" y1="7" x2="12" y2="17" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                    </svg>
                                </div>
                                計算說明
                            </h4>
                            <button
                                onClick={() => setShowExplanation(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    color: 'var(--text-tertiary)',
                                    padding: '0.25rem'
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem'
                        }}>
                            {/* Section 1: Formula */}
                            <section>
                                <div style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: 'var(--accent)',
                                    marginBottom: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '6px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="2.5" />
                                            <line x1="8" y1="12" x2="16" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                            <line x1="8" y1="8" x2="16" y2="8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                            <line x1="8" y1="16" x2="12" y2="16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    計算依據
                                </div>
                                <div style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--text-secondary)',
                                    lineHeight: 1.6,
                                    background: 'var(--bg-app)',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-sm)'
                                }}>
                                    <strong>天數</strong> = (當前體重 - 目標體重) × 7700 ÷ 每日缺口
                                    <br /><br />
                                    <strong>每日缺口</strong> = TDEE - 安全攝入底線
                                </div>
                            </section>

                            {/* Section 2: Why this deficit */}
                            <section>
                                <div style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: 'var(--accent)',
                                    marginBottom: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '6px',
                                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2C12 2 8 6 8 10C8 12.2091 9.79086 14 12 14C14.2091 14 16 12.2091 16 10C16 6 12 2 12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 14C9 14 6 16 6 19C6 21 7.5 22 12 22C16.5 22 18 21 18 19C18 16 15 14 12 14Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    為什麼是 {daily_deficit} kcal 缺口？
                                </div>
                                <div style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--text-secondary)',
                                    lineHeight: 1.6
                                }}>
                                    您的每日總消耗 (TDEE) 為 <strong>{tdee} kcal</strong>，減去安全攝入底線 <strong>{min_intake_floor} kcal</strong>，得出 <strong>{daily_deficit} kcal</strong> 的每日缺口。
                                    <br /><br />
                                    這是在保證健康的前提下，您的身體能夠支持的最大安全缺口。
                                </div>
                            </section>

                            {/* Section 3: Safety baseline */}
                            <section>
                                <div style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: 'var(--accent)',
                                    marginBottom: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '6px',
                                        background: 'var(--accent)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2L4 6V11C4 16 7.5 20.5 12 22C16.5 20.5 20 16 20 11V6L12 2Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    安全底線說明
                                </div>
                                <div style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--text-secondary)',
                                    lineHeight: 1.6
                                }}>
                                    安全攝入底線基於<strong>生理學需求</strong>：
                                    <br /><br />
                                    <strong>女性：</strong>去脂體重 (LBM) × 30 kcal
                                    <br />
                                    低於此數值會導致<strong>下視丘閉經 (FHA)</strong>，影響荷爾蒙平衡與生殖健康。
                                    <br /><br />
                                    <strong>男性：</strong>BMR（基礎代謝率）
                                    <br />
                                    不得低於維持基本生理功能（呼吸、心跳、體溫）所需的最低能量。
                                </div>
                            </section>

                            {/* Section 4: Days calculation */}
                            <section>
                                <div style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: 'var(--accent)',
                                    marginBottom: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '6px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="13" r="9" stroke="white" strokeWidth="2" />
                                            <path d="M12 8V13L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                            <line x1="12" y1="2" x2="12" y2="4" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    天數計算
                                </div>
                                <div style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--text-secondary)',
                                    lineHeight: 1.6
                                }}>
                                    根據<strong>物理定律</strong>：1 公斤脂肪組織 ≈ 7700 kcal 能量缺口
                                    <br /><br />
                                    以您的每日缺口 {daily_deficit} kcal，預計需要 <strong>{days_to_goal} 天</strong>達成目標。
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

function MetricBox({ icon, label, value, unit }: {
    icon: string;
    label: string;
    value: string;
    unit: string;
}) {
    // Icon mapping
    const iconMap: Record<string, { svg: React.ReactElement; gradient: string }> = {
        '⏱️': {
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            svg: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="13" r="9" stroke="white" strokeWidth="2" />
                    <path d="M12 8V13L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <line x1="12" y1="2" x2="12" y2="4" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
            )
        },
        '🔥': {
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            svg: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C12 2 8 6 8 10C8 12.2091 9.79086 14 12 14C14.2091 14 16 12.2091 16 10C16 6 12 2 12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 14C9 14 6 16 6 19C6 21 7.5 22 12 22C16.5 22 18 21 18 19C18 16 15 14 12 14Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        }
    };

    const iconData = iconMap[icon] || iconMap['⏱️'];

    return (
        <div style={{
            background: 'var(--bg-app)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
        }}>
            <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: iconData.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
                {iconData.svg}
            </div>
            <div style={{
                fontSize: '0.7rem',
                color: 'var(--text-tertiary)',
                fontWeight: 500
            }}>
                {label}
            </div>
            <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.25rem'
            }}>
                <span style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)'
                }}>
                    {value}
                </span>
                <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)'
                }}>
                    {unit}
                </span>
            </div>
        </div>
    );
}

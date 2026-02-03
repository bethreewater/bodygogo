'use client';

import Link from 'next/link';
import { GoalProjection } from '@/lib/core/types';

interface GoalCountdownProps {
    projection: GoalProjection;
}

/**
 * Goal Countdown - Compact countdown card for home page
 * Shows days remaining until goal achievement
 */
export function GoalCountdown({ projection }: GoalCountdownProps) {
    const { days_to_goal, target_date, is_achievable } = projection;

    if (!is_achievable || days_to_goal === 0) {
        return null; // Don't show if not achievable or already reached
    }

    // Format target date
    const formattedDate = new Date(target_date).toLocaleDateString('zh-TW', {
        month: 'long',
        day: 'numeric'
    });

    return (
        <Link href="/body" style={{ textDecoration: 'none' }}>
            <div style={{
                background: 'linear-gradient(135deg, var(--accent) 0%, #6a9c7a 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                boxShadow: '0 4px 16px rgba(127, 160, 133, 0.25)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
            }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(127, 160, 133, 0.35)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(127, 160, 133, 0.25)';
                }}
            >
                {/* Background decoration */}
                <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    pointerEvents: 'none'
                }} />

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative',
                    zIndex: 1
                }}>
                    {/* Left: Icon + Text */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L4 6V11C4 16 7.5 20.5 12 22C16.5 20.5 20 16 20 11V6L12 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                                <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <div style={{
                                fontSize: '0.75rem',
                                color: 'rgba(255, 255, 255, 0.9)',
                                marginBottom: '0.25rem',
                                fontWeight: 500
                            }}>
                                距離目標還有
                            </div>
                            <div style={{
                                fontSize: '0.875rem',
                                color: 'rgba(255, 255, 255, 0.75)',
                                fontWeight: 400
                            }}>
                                預計 {formattedDate}
                            </div>
                        </div>
                    </div>

                    {/* Right: Days countdown */}
                    <div style={{
                        textAlign: 'right'
                    }}>
                        <div style={{
                            fontSize: '2.5rem',
                            fontWeight: 700,
                            color: 'white',
                            lineHeight: 1,
                            marginBottom: '0.25rem'
                        }}>
                            {days_to_goal}
                        </div>
                        <div style={{
                            fontSize: '0.875rem',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: 500
                        }}>
                            天
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

'use client';
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { PublicProfile } from '@/lib/core/types';


export function UserCard({ profile, rank }: { profile: PublicProfile; rank?: number }) {
    const [cheers, setCheers] = useState(0);
    const [hasCheered, setHasCheered] = useState(false);

    // Mock cheer logic
    const handleCheer = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!hasCheered) {
            setCheers(c => c + 1);
            setHasCheered(true);
        }
    };

    const isTop3 = rank && rank <= 3;
    const rankColor = rank === 1 ? '#FDE047' : rank === 2 ? '#E5E7EB' : rank === 3 ? '#FDBA74' : 'transparent';

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.2s',
            cursor: 'pointer'
        }}
            className="hover-lift" // assuming global css has this, or I'll add inline style
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
            {/* Rank Badge */}
            {isTop3 && (
                <div style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    background: rankColor,
                    padding: '4px 12px',
                    borderBottomLeftRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: rank === 2 ? '#374151' : '#78350F'
                }}>
                    #{rank}
                </div>
            )}

            {/* Profile Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                    overflow: 'hidden'
                }}>
                    {profile.avatar_config ? (
                        <img
                            src={profile.avatar_config.type === 'preset' ? `/avatars/${profile.avatar_config.value}.png` : profile.avatar_config.value}
                            alt={profile.username}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        ['🦊', '🦁', '🐼', '🐨', '🐯', '🐸'][profile.username.length % 6]
                    )}
                </div>
                <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.125rem' }}>
                        {profile.username}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>LVL {profile.level}</span>
                        <span>•</span>
                        <span>{profile.streak ?? 0} 天連續</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar (Privacy protected) */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem', color: 'var(--text-tertiary)' }}>
                    <span>今日目標完成度</span>
                    {profile.quest_completion_ratio !== undefined ? (
                        <span>{Math.round(profile.quest_completion_ratio * 100)}%</span>
                    ) : (<span>🔒</span>)}
                </div>
                <div style={{ height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%',
                        width: `${(profile.quest_completion_ratio || 0) * 100}%`,
                        background: 'linear-gradient(90deg, var(--accent), #f472b6)',
                        borderRadius: '4px'
                    }} />
                </div>
            </div>

            {/* Bottom Action Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    {profile.is_active_today ? (
                        <span style={{ color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                            剛剛活躍
                        </span>
                    ) : '2h ago'}
                </div>

                <button
                    onClick={handleCheer}
                    style={{
                        background: hasCheered ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                        border: 'none',
                        color: hasCheered ? '#EF4444' : 'var(--text-tertiary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        transition: 'all 0.2s'
                    }}
                >
                    <span>{hasCheered ? '❤️' : '🤍'}</span>
                    <span>{cheers > 0 ? cheers : '加油'}</span>
                </button>
            </div>
        </div>
    );
}

export function LeaderboardHeader() {
    return (
        <div style={{
            marginTop: '-1rem',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            color: 'white',
            boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)',
            textAlign: 'center'
        }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>🏆 本週排行榜</h2>
            <p style={{ opacity: 0.9, fontSize: '0.9375rem' }}>
                前 3 名用戶將獲得專屬徽章！
            </p>
        </div>
    );
}

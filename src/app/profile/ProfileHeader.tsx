'use client';
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { UserProfile, GameState } from '@/lib/core/types';
import { AvatarPicker } from '../components/AvatarPicker';
import { updateProfile } from '../actions/settings';

export function ProfileHeader({ profile, gameState }: { profile: UserProfile; gameState: GameState }) {
    const [isEditing, setIsEditing] = useState(false);
    const [avatarConfig, setAvatarConfig] = useState<NonNullable<UserProfile['avatar_config']>>(
        profile.avatar_config || { type: 'preset', value: 'boy' }
    );

    // Helper to get avatar src
    const getAvatarSrc = (config: typeof avatarConfig) => {
        if (config.type === 'preset') {
            return `/avatars/${config.value}.png`; // Assuming simple mapping
        }
        return config.value;
    };

    const handleSaveAvatar = async (config: typeof avatarConfig | undefined) => {
        if (!config) return;
        setAvatarConfig(config);
        setIsEditing(false);
        await updateProfile({ avatar_config: config });
    };

    return (
        <section style={{
            background: 'var(--bg-card)',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-soft)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            position: 'relative',
            transition: 'all 0.3s ease'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', width: '100%' }}>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    style={{
                        position: 'relative',
                        width: '96px',
                        height: '96px',
                        borderRadius: '50%',
                        background: 'var(--bg-surface)',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                        flexShrink: 0
                    }}
                >
                    {/* Avatar Image */}
                    <img
                        src={getAvatarSrc(avatarConfig)}
                        alt="Avatar"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                            // Fallback
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).parentElement!.innerText = '👤';
                        }}
                    />

                    {/* Edit Badge */}
                    <div style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        background: 'var(--accent)',
                        color: 'white',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        border: '2px solid var(--bg-card)'
                    }}>
                        📷
                    </div>
                </button>

                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>探險家</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Lv. {gameState.level} • {gameState.xp_current} XP
                    </p>
                </div>
            </div>

            {/* Editing Panel (Expands in flow) */}
            {isEditing && (
                <div style={{
                    width: '100%',
                    marginTop: '0.5rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border-color)',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <style jsx global>{`
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(-5px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}</style>
                    <AvatarPicker currentConfig={avatarConfig} onSave={handleSaveAvatar} />
                </div>
            )}
        </section>
    );
}

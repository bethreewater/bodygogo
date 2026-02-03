'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react';
import { FeedItem } from '@/lib/core/types';
import { sendEnergyAction } from '@/app/actions/community';
import { PrivacyBadge } from '@/app/components/PrivacyBadge';

// Utility class concatenator
function cn(...classes: (string | undefined | null | boolean)[]) {
    return classes.filter(Boolean).join(' ');
}

// Avatar Mapping Configuration
const AVATAR_MAP: Record<string, string> = {
    // Presets
    'adventurer': '/avatars/girl.png',
    'warrior': '/avatars/boy.png',
    'wizard': '/avatars/robot.png',
    // Direct matches
    'girl': '/avatars/girl.png',
    'boy': '/avatars/boy.png',
    'cat': '/avatars/cat.png',
    'dog': '/avatars/dog.png',
    'robot': '/avatars/robot.png',
    // Fallback
    'default': '/images/character-zen.png'
};

/* 
 * ACTION THEMES
 * Each state has a specific color identity for better visual scanning.
 */
const ACTION_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
    'working': {
        label: '專注中',
        color: 'bg-blue-50 text-blue-600 border-blue-100',
        icon: '💼'
    },
    'exercising': {
        label: '揮灑汗水',
        color: 'bg-orange-50 text-orange-600 border-orange-100',
        icon: '💪'
    },
    'relaxing': {
        label: '休息充電',
        color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        icon: '🍵'
    },
    // Default / Fallback
    'default': {
        label: '生活中',
        color: 'bg-stone-50 text-stone-600 border-stone-100',
        icon: '🌱'
    }
};

interface FeedItemCardProps {
    item: FeedItem;
    isSelf?: boolean;
}

export function FeedItemCard({ item, isSelf }: FeedItemCardProps) {
    const [hasCheered, setHasCheered] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // --- Safety Checks ---
    if (!item || !item.semantics) {
        return null; // Prevent crash if data is malformed
    }

    // Semantics Extraction
    const { streak_aura, action_hint } = item.semantics;
    const legacySemantics = item.semantics as Partial<{ aura: string; action: string }>;

    // Resolve Configuration
    const aura = streak_aura || legacySemantics.aura || 'none';
    const actionKey = action_hint || legacySemantics.action || 'default';
    const config = ACTION_CONFIG[actionKey] || ACTION_CONFIG['default'];

    // Resolve Avatar
    const avatarValue = item.avatar_config?.value || 'default';
    const avatarSrc = AVATAR_MAP[avatarValue] || AVATAR_MAP['default'];

    const handleSendEnergy = async (e: React.MouseEvent | React.KeyboardEvent) => {
        if (isSelf || hasCheered || isSending) return;

        // Keyboard safety: Only trigger on Enter or Space
        if ('key' in e && e.key !== 'Enter' && e.key !== ' ') return;

        e.stopPropagation();
        setIsSending(true);
        setHasCheered(true);
        try {
            await sendEnergyAction(item.uid);
        } catch (error) {
            console.error('Failed to send energy', error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <button
            onClick={handleSendEnergy}
            onKeyDown={handleSendEnergy}
            disabled={isSelf || hasCheered}
            className={cn(
                "w-full text-left relative flex flex-col gap-3 p-5",
                "rounded-2xl border", // removed bg-white
                "transition-all duration-300 ease-out",
                // Hover Effects: Lift & Subtle Shadow
                !isSelf && !hasCheered && "hover:-translate-y-1 hover:shadow-lg cursor-pointer",
                // Self State: Ring highlight
                isSelf ? "ring-2 ring-[#7FA085]/40 cursor-default" : "shadow-sm",
                // Cheered State: Pink glow
                hasCheered && "ring-2 ring-pink-100 cursor-default"
            )}
            style={{
                background: hasCheered ? 'rgba(255, 192, 203, 0.1)' : 'var(--bg-card)',
                borderColor: 'var(--glass-border)',
                // boxShadow: 'var(--shadow-soft)' // optional if class shadow-sm isn't enough
            }}
            aria-label={`用戶 ${item.nickname}, 等級 ${item.level}, 狀態: ${config.label}`}
        >
            {/* Top Row: Avatar & Identity & Status */}
            <div className="flex justify-between items-start w-full">
                <div className="flex items-center gap-3">
                    {/* circular Avatar */}
                    <div className={cn(
                        "w-11 h-11 rounded-full border-2 overflow-hidden flex-shrink-0 transition-transform duration-500",
                        isSelf ? "border-[#7FA085]" : "border-transparent shadow-sm"
                    )} style={{ background: 'var(--bg-surface)' }}>
                        <img
                            src={avatarSrc}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[15px] font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                            {item.nickname || '神秘旅人'}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-medium px-1.5 rounded-md" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                                Lv.{item.level}
                            </span>
                            {item.privacy && <PrivacyBadge privacy={item.privacy} size="sm" />}
                            {aura !== 'none' && (
                                <span className="text-[10px] text-orange-500 font-bold">
                                    🔥 連勝中
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status Pill */}
                <div className={cn(
                    "flex items-center gap-1 pl-2 pr-2.5 py-1 rounded-full text-[11px] font-bold border",
                    // We modify config colors to be softer or use variables? 
                    // For now, keep Tailwind utility classes for badges as they are distinct semantic colors
                    // But maybe ensure they don't look weird on dark mode.
                    config.color
                )}>
                    <span className="text-[10px]">{config.icon}</span>
                    <span>{config.label}</span>
                </div>
            </div>

            {/* Bottom Row: Interaction Hint */}
            <div className="mt-2 flex items-center justify-between w-full h-6 pl-[56px]">
                <span className={cn(
                    "text-[11px] transition-colors duration-300",
                    hasCheered ? "text-pink-500 font-medium" : ""
                )} style={{ color: hasCheered ? undefined : 'var(--text-tertiary)' }}>
                    {isSelf ? '(你自己)' : hasCheered ? '已發送鼓勵！' : '點擊給予鼓勵'}
                </span>

                {/* Heart Button */}
                <div className={cn(
                    "transition-all duration-500 flex items-center justify-center w-8 h-8 rounded-full",
                    isSelf ? "opacity-0" : "opacity-100",
                    // !hasCheered && "group-hover:bg-pink-50", // logic on hover is tricky with inline styles
                    hasCheered ? "scale-110 text-pink-500" : "scale-100 group-hover:text-pink-400"
                )} style={{ color: hasCheered ? undefined : 'var(--text-tertiary)' }}>
                    <span className={cn(
                        "text-lg transition-transform duration-300",
                        // !hasCheered && "group-hover:scale-110",
                        hasCheered && "animate-[bounce_0.6s_infinite]"
                    )}>
                        ♥
                    </span>
                </div>
            </div>
        </button>
    );
}

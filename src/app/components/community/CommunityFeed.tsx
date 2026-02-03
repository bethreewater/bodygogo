'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FeedItem } from '@/lib/core/types';
import { FeedItemCard } from './FeedItemCard';
import { seedCommunityAction } from '@/app/actions/community';
import { PrivacyBadge } from '@/app/components/PrivacyBadge';

interface CommunityFeedProps {
    items: FeedItem[];
    currentUserId?: string;
    currentPrivacy?: 'public' | 'private';
}

export function CommunityFeed({ items, currentUserId, currentPrivacy }: CommunityFeedProps) {
    const router = useRouter();
    const [isSeeding, setIsSeeding] = useState(false);

    const handleSeed = async () => {
        if (isSeeding) return;
        setIsSeeding(true);
        try {
            await seedCommunityAction();
            router.refresh(); // Refresh to show new data
        } catch (error) {
            console.error('Seeding failed', error);
        } finally {
            setIsSeeding(false);
        }
    };

    // --- Empty State (Chinese) ---
    if (!items || items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-4">
                    <span className="text-4xl opacity-50">🌱</span>
                </div>
                <h3 className="text-[#4A4A45] font-bold text-lg mb-2">原野一片寧靜</h3>
                <p className="text-[#858580] text-sm mb-8 max-w-[200px]">
                    目前還沒有其他夥伴。<br />成為第一道光，或呼喚他們加入。
                </p>
                {currentPrivacy === 'private' && (
                    <p className="text-[#858580] text-xs mb-6 max-w-[220px]">
                        你目前是私人模式，不會出現在社群中。可到設定調整為公開。
                    </p>
                )}

                <button
                    onClick={handleSeed}
                    disabled={isSeeding}
                    aria-busy={isSeeding}
                    className="px-6 py-2 bg-[#7FA085] text-white text-sm font-bold rounded-lg shadow-sm hover:bg-[#6b8c71] transition-all active:scale-95 disabled:opacity-50"
                >
                    {isSeeding ? '呼喚中...' : '呼喚夥伴 (Demo)'}
                </button>
                {currentPrivacy === 'private' && (
                    <Link
                        href="/settings"
                        className="mt-3 text-xs font-semibold underline"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        前往設定切換為公開
                    </Link>
                )}
            </div>
        );
    }

    // --- Main Content ---
    return (
        <div className="w-full flex flex-col gap-6">
            {/* Simple Header (Chinese) */}
            <div className="flex flex-col gap-2 pt-2 px-1">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    社群動態
                </h2>

                {currentPrivacy && (
                    <div className="flex items-center gap-2">
                        <PrivacyBadge privacy={currentPrivacy} withIcon />
                        {currentPrivacy === 'private' && (
                            <Link
                                href="/settings"
                                className="text-[11px] font-semibold underline"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                去設定
                            </Link>
                        )}
                    </div>
                )}

                    {items.length < 5 && (
                        <button
                            onClick={handleSeed}
                            disabled={isSeeding}
                            className="text-xs font-bold hover:underline disabled:opacity-50"
                            style={{ color: 'var(--brand)' }}
                        >
                            {isSeeding ? '...' : '+ 呼喚夥伴'}
                        </button>
                    )}
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    與 {items.length} 位夥伴一同成長
                </p>
            </div>

            {/* Grid - Adjusted for cleaner single column flow */}
            <div className="flex flex-col gap-4 pb-24">
                {items.map((item, index) => (
                    <div
                        key={item.uid}
                        className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-backwards"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <FeedItemCard
                            item={item}
                            isSelf={currentUserId === item.uid}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

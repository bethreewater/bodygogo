'use client';

import { useState } from 'react';
import { seedCommunityAction } from '@/app/actions/community';

export default function SeedPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSeed = async () => {
        setStatus('loading');
        try {
            const res = await seedCommunityAction();
            if (res.success) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-4">
            <h1 className="text-xl font-bold mb-4 text-stone-700">社群測試資料產生器</h1>
            <p className="text-sm text-stone-500 mb-8 max-w-md text-center">
                這會將你設為公開狀態並建立基本遊戲狀態，讓社群頁面能顯示你的動態。
            </p>

            {status === 'idle' && (
                <button
                    onClick={handleSeed}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-full shadow hover:bg-indigo-700 transition"
                >
                    開啟社群展示
                </button>
            )}

            {status === 'loading' && (
                <div className="text-indigo-600 animate-pulse">正在召喚夥伴...</div>
            )}

            {status === 'success' && (
                <div className="text-center flex flex-col items-center gap-4">
                    <div className="text-green-600 font-bold">✨ 成功！已開啟社群展示。</div>
                    <a href="/community" className="text-stone-500 underline text-sm hover:text-stone-800">
                        前往社群頁面 →
                    </a>
                </div>
            )}

            {status === 'error' && (
                <div className="text-red-500">發生錯誤，請檢查 Console。</div>
            )}
        </div>
    );
}

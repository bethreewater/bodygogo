'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export function DateSwitcher({ currentDate }: { currentDate: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleDateChange = (days: number) => {
        const date = new Date(currentDate);
        date.setDate(date.getDate() + days);

        // Format YYYY-MM-DD manually to avoid UTC shifts
        const nextDateStr = date.toISOString().split('T')[0];

        const params = new URLSearchParams(searchParams);
        params.set('date', nextDateStr);
        router.push(`/?${params.toString()}`);
    };

    const displayDate = new Date(currentDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'rgba(255,255,255,0.05)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--glass-border)'
        }}>
            <button
                onClick={() => handleDateChange(-1)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
                <ChevronLeft size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '140px', justifyContent: 'center' }}>
                <Calendar size={16} style={{ opacity: 0.5 }} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{displayDate}</span>
            </div>

            <button
                onClick={() => handleDateChange(1)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}

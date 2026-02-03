import React from 'react';
import { MetricDisplayState } from '@/lib/core/types';

/**
 * MetricCard Component
 * Implements strict 3-state display logic: Ready, Processing, Failed.
 * Redesigned for Organic Luxury aesthetic.
 */

interface MetricCardProps<T> {
    title: string;
    data: MetricDisplayState<T>;
    unit?: string;
    formatValue?: (val: T) => string;
}

export function MetricCard<T>({ title, data, unit, formatValue }: MetricCardProps<T>) {
    // Safe default formatter
    const format = (v: T | null | undefined) => {
        if (v === null || v === undefined) return '--';
        return formatValue ? formatValue(v) : String(v);
    };

    const isProcessing = data.status === 'processing';
    const isFailed = data.status === 'failed';

    // Value to show: Current if ready, Last Known if processing/failed
    const showValue = data.status === 'ready' ? data.value :
        (data.status === 'processing' || data.status === 'failed') ? data.lastValue : null;

    return (
        <div style={{
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: 'none',
            boxShadow: 'var(--shadow-soft)',
            minHeight: '140px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}>
            {/* Subtle Label */}
            <div style={{ marginBottom: '1rem' }}>
                <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-tertiary)',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                }}>
                    {title}
                </span>
            </div>

            {/* Large Value */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{
                    fontSize: '3rem',
                    fontWeight: 600,
                    color: isProcessing ? 'var(--text-tertiary)' : 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                    lineHeight: '1'
                }}>
                    {format(showValue)}
                </span>
                {unit && <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 400 }}>{unit}</span>}
            </div>

            {/* Processing State Indicator */}
            {isProcessing && (
                <div style={{
                    marginTop: '1rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-tertiary)'
                }}>
                    更新中...
                </div>
            )}

            {/* Error State */}
            {isFailed && (
                <div style={{
                    marginTop: '1rem',
                    fontSize: '0.75rem',
                    color: 'var(--error)'
                }}>
                    暫時無法取得
                </div>
            )}
        </div>
    );
}

'use client';

import React from 'react';

interface TrendSparklineProps {
    data: number[];
    height?: number;
    color?: string;
    showDots?: boolean;
}

export function TrendSparkline({
    data,
    height = 60,
    color = 'var(--accent)',
    showDots = false
}: TrendSparklineProps) {
    if (!data || data.length === 0) {
        return (
            <div style={{
                height: `${height}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-tertiary)',
                fontSize: '0.75rem'
            }}>
                暫無數據
            </div>
        );
    }

    const values = data; // Data is already number[]
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1; // Avoid division by zero

    // Calculate SVG path
    const width = 200;
    const padding = 4;
    const stepX = (width - padding * 2) / (data.length - 1 || 1);

    const points = data.map((d, i) => {
        const x = padding + i * stepX;
        const y = height - padding - ((d - min) / range) * (height - padding * 2);
        return { x, y, value: d };
    });

    const pathData = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');

    return (
        <svg
            width="100%"
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            style={{ overflow: 'visible' }}
        >
            {/* Line */}
            <path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Dots */}
            {showDots && points.map((p, i) => (
                <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r="3"
                    fill={color}
                />
            ))}
        </svg>
    );
}

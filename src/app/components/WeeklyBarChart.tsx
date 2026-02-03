'use client';

{/* Simple Bar Chart for Weekly Trends */ }
interface WeeklyBarChartProps {
    data: number[];
    labels: string[]; // e.g., ["M", "T", "W", "T", "F", "S", "S"]
    height?: number;
    color?: string;
}

export function WeeklyBarChart({
    data,
    labels,
    height = 100,
    color = 'var(--accent)',
}: WeeklyBarChartProps) {
    if (!data || data.length === 0) {
        return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>暫無數據</div>;
    }

    const max = Math.max(...data) || 1;

    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: height, gap: '4px' }}>
            {data.map((val, i) => {
                const heightPct = (val / max) * 100;
                return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '0.25rem' }}>
                        {/* Bar Container */}
                        <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',

                        }}>
                            <div style={{
                                width: '60%',
                                height: `${Math.max(heightPct, 4)}%`, // Min height for visibility
                                background: color,
                                borderRadius: '4px',
                                opacity: 0.8,
                                transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                minHeight: '4px'
                            }}>
                                {/* Value popup on hover could go here, but keeping it simple for now */}
                            </div>
                        </div>
                        {/* Label */}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{labels[i]}</span>
                    </div>
                );
            })}
        </div>
    );
}

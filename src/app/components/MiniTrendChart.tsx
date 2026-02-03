'use client';

interface DataPoint {
    date: string;
    value: number;
}

interface MiniTrendChartProps {
    data: DataPoint[];
    targetValue: number;
    label: string;
    color?: string;
}

/**
 * Mini Trend Chart - Shows historical data with prediction line
 * Displays actual weight/body fat changes over time
 */
export function MiniTrendChart({
    data,
    targetValue,
    label,
    color = 'var(--accent)',
}: MiniTrendChartProps) {
    if (data.length === 0) {
        return null;
    }

    // Calculate dimensions
    const width = 100; // percentage
    const height = 120;
    const padding = { top: 10, right: 10, bottom: 20, left: 35 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Get min/max values for scaling
    const values = data.map(d => d.value);
    const allValues = [...values, targetValue];
    const minValue = Math.min(...allValues) * 0.98; // 2% padding
    const maxValue = Math.max(...allValues) * 1.02;
    const valueRange = maxValue - minValue;

    // Scale functions
    const scaleX = (index: number) => (index / (data.length - 1)) * chartWidth;
    const scaleY = (value: number) => chartHeight - ((value - minValue) / valueRange) * chartHeight;

    // Create path for actual data
    const actualPath = data
        .map((d, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(d.value)}`)
        .join(' ');

    // Create prediction line (from last point to target)
    const lastDataPoint = data[data.length - 1];
    const predictionPath = `M ${scaleX(data.length - 1)} ${scaleY(lastDataPoint.value)} L ${chartWidth} ${scaleY(targetValue)}`;

    // Format dates
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
        }}>
            {/* Label */}
            <div style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-tertiary)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
            }}>
                {label} 趨勢
            </div>

            {/* Chart Container */}
            <div style={{
                position: 'relative',
                width: '100%',
                height: `${height}px`,
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                padding: '0.5rem'
            }}>
                <svg
                    width="100%"
                    height={height}
                    viewBox={`0 0 ${width} ${height}`}
                    preserveAspectRatio="none"
                    style={{ overflow: 'visible' }}
                >
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                        <line
                            key={i}
                            x1={padding.left}
                            y1={padding.top + ratio * chartHeight}
                            x2={padding.left + chartWidth}
                            y2={padding.top + ratio * chartHeight}
                            stroke="rgba(0, 0, 0, 0.05)"
                            strokeWidth="0.5"
                        />
                    ))}

                    {/* Target line */}
                    <line
                        x1={padding.left}
                        y1={padding.top + scaleY(targetValue)}
                        x2={padding.left + chartWidth}
                        y2={padding.top + scaleY(targetValue)}
                        stroke={color}
                        strokeWidth="1"
                        strokeDasharray="2,2"
                        opacity="0.5"
                    />

                    {/* Actual data line */}
                    <g transform={`translate(${padding.left}, ${padding.top})`}>
                        <path
                            d={actualPath}
                            fill="none"
                            stroke={color}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Data points */}
                        {data.map((d, i) => (
                            <circle
                                key={i}
                                cx={scaleX(i)}
                                cy={scaleY(d.value)}
                                r="2.5"
                                fill="white"
                                stroke={color}
                                strokeWidth="2"
                            />
                        ))}
                    </g>

                    {/* Prediction line */}
                    <g transform={`translate(${padding.left}, ${padding.top})`}>
                        <path
                            d={predictionPath}
                            fill="none"
                            stroke={color}
                            strokeWidth="1.5"
                            strokeDasharray="4,4"
                            opacity="0.6"
                        />
                    </g>

                    {/* Y-axis labels */}
                    <text
                        x={padding.left - 5}
                        y={padding.top + scaleY(maxValue)}
                        textAnchor="end"
                        fontSize="8"
                        fill="var(--text-tertiary)"
                    >
                        {maxValue.toFixed(1)}
                    </text>
                    <text
                        x={padding.left - 5}
                        y={padding.top + scaleY(minValue)}
                        textAnchor="end"
                        fontSize="8"
                        fill="var(--text-tertiary)"
                    >
                        {minValue.toFixed(1)}
                    </text>

                    {/* X-axis labels */}
                    <text
                        x={padding.left}
                        y={height - 5}
                        textAnchor="start"
                        fontSize="8"
                        fill="var(--text-tertiary)"
                    >
                        {formatDate(data[0].date)}
                    </text>
                    <text
                        x={padding.left + chartWidth}
                        y={height - 5}
                        textAnchor="end"
                        fontSize="8"
                        fill="var(--text-tertiary)"
                    >
                        目標
                    </text>
                </svg>
            </div>

            {/* Legend */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                justifyContent: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <div style={{
                        width: '12px',
                        height: '2px',
                        background: color,
                        borderRadius: '1px'
                    }} />
                    <span>實際</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <div style={{
                        width: '12px',
                        height: '2px',
                        background: color,
                        borderRadius: '1px',
                        opacity: 0.6,
                        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, ' + color + ' 2px, ' + color + ' 4px)'
                    }} />
                    <span>預測</span>
                </div>
            </div>
        </div>
    );
}

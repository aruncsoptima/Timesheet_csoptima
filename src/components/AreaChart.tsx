import React from 'react';
import { Box } from '@mui/material';

type AreaChartProps = {
    data: number[];
    width?: number;
    height?: number;
    color?: string;
};

export default function AreaChart({
    data,
    width = 600,
    height = 220,
    color = '#2563eb'
}: AreaChartProps) {
    if (!data || data.length === 0) {
        return <Box component="svg" width={width} height={height} />;
    }

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const step = width / (data.length - 1);
    const points = data
        .map((d, i) => `${i * step},${height - ((d - min) / range) * height}`)
        .join(' ');

    const areaPath = `M0,${height} L ${points} L ${width},${height} Z`;

    return (
        <Box
            component="svg"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            sx={{ display: 'block' }}
        >
            {/* Filled Area */}
            <path d={areaPath} fill={`${color}22`} />

            {/* Line Path */}
            <polyline
                fill="none"
                stroke={color}
                strokeWidth={2}
                points={points}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Box>
    );
}

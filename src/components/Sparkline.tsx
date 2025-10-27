import React from 'react';
import Box from '@mui/material/Box';

type Props = { data: number[], width?: number, height?: number, color?: string };

export default function Sparkline({ data, width = 120, height = 28, color = '#2563eb' }: Props) {
    if (!data || data.length === 0)
        return <Box component="svg" width={width} height={height}></Box>;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const step = width / (data.length - 1);
    const points = data.map((d, i) => `${i * step},${height - ((d - min) / range) * height}`).join(' ');

    return (
        <Box
            component="svg"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
        >
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

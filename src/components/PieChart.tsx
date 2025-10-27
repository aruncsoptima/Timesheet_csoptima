import React from 'react';
import { Box } from '@mui/material';

type Slice = { value: number; color?: string; label?: string };

export default function PieChart({
    slices,
    size = 120
}: {
    slices: Slice[];
    size?: number;
}) {
    const total = slices.reduce((sum, x) => sum + Math.max(0, x.value), 0) || 1;
    let angle = -90;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 6;

    const paths = slices.map((slice, i) => {
        const portion = slice.value / total;
        const delta = portion * 360;
        const largeArc = delta > 180 ? 1 : 0;
        const start = polarToCartesian(cx, cy, r, angle);
        angle += delta;
        const end = polarToCartesian(cx, cy, r, angle);

        const d = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;

        return {
            d,
            color: slice.color || defaultColors[i % defaultColors.length],
            label: slice.label
        };
    });

    return (
        <Box
            component="svg"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            sx={{ display: 'block' }}
        >
            {paths.map((p, i) => (
                <path key={i} d={p.d} fill={p.color} stroke="#fff" strokeWidth={1} />
            ))}
            {/* Center white circle to make it a donut chart-like */}
            <circle cx={cx} cy={cy} r={r * 0.5} fill="#fff" />
        </Box>
    );
}

const defaultColors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#7c3aed'];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

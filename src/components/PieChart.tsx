import React from 'react'

type Slice = { value: number, color?: string, label?: string }

export default function PieChart({ slices, size = 120 }: { slices: Slice[], size?: number }) {
    const total = slices.reduce((s, x) => s + Math.max(0, x.value), 0) || 1
    let angle = -90
    const cx = size / 2, cy = size / 2, r = size / 2 - 6
    const paths = slices.map((s, i) => {
        const portion = s.value / total
        const delta = portion * 360
        const large = delta > 180 ? 1 : 0
        const start = polarToCartesian(cx, cy, r, angle)
        angle += delta
        const end = polarToCartesian(cx, cy, r, angle)
        const d = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`
        return { d, color: s.color || defaultColors[i % defaultColors.length], label: s.label }
    })
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} stroke="#fff" strokeWidth={1} />)}
            <circle cx={cx} cy={cy} r={r * 0.5} fill="#fff" />
        </svg>
    )
}

const defaultColors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#7c3aed']

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const a = (angleDeg - 90) * Math.PI / 180.0
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

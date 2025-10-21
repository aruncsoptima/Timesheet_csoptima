import React from 'react'

export default function AreaChart({ data, width = 600, height = 220, color = '#2563eb' }: { data: number[], width?: number, height?: number, color?: string }) {
    if (!data || data.length === 0) return <svg width={width} height={height}></svg>
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    const step = width / (data.length - 1)
    const points = data.map((d, i) => `${i * step},${height - ((d - min) / range) * height}`).join(' ')
    const areaPath = `M0,${height} L ${points} L ${width},${height} Z`
    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <path d={areaPath} fill={`${color}22`} stroke="none" />
            <polyline fill="none" stroke={color} strokeWidth={2} points={points} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

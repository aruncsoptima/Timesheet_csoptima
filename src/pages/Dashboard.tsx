import React from 'react'
import { useNavigate } from 'react-router-dom'
import TimePunch from '../components/TimePunch'
import Sparkline from '../components/Sparkline'
import PieChart from '../components/PieChart'
import AreaChart from '../components/AreaChart'

function safeParse(key: string) {
    try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}

function prettyCount(arr: any[] | null | undefined) {
    return arr ? arr.length : 0
}

type RecentListProps = {
    items: any[]
    fields?: string[]
    noneText?: string
}

function RecentList({ items, fields = ['date'], noneText = 'No data found' }: RecentListProps) {
    if (!items || items.length === 0) return <div className="muted">{noneText}</div>
    return (
        <ul className="recent-list">
            {items.slice(0, 3).map((it: any, i: number) => (
                <li key={i} className="recent-item">
                    {fields.map((f, idx) => <span key={idx} className="ri">{it[f] ?? ''}</span>)}
                </li>
            ))}
        </ul>
    )
}

export default function Dashboard() {
    const navigate = useNavigate()

    const go = (path: string) => () => navigate(path)
    const logs = safeParse('timesheet:logs')
    const leaves = safeParse('timesheet:leaves')
    const claims = safeParse('timesheet:claims')

    // timesheet weekday distribution (simple)
    const weekdayCounts = [0, 0, 0, 0, 0, 0, 0]
    logs.forEach((l: any) => { try { const d = new Date(l.start); weekdayCounts[d.getDay()]++ } catch { } })
    const weekdaySlices = weekdayCounts.map((v, i) => ({ value: v, label: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i] }))

    // leaves by status
    const leavesByStatus = ['Pending', 'Approved', 'Rejected'].map(s => ({ value: leaves.filter((l: any) => l.status === s).length, label: s }))

    // claims by status
    const claimsByStatus = ['Pending', 'Approved', 'Rejected'].map(s => ({ value: claims.filter((c: any) => c.status === s).length, label: s }))

    // compute timesheet totals
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const dayOfWeek = now.getDay() // 0..6
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek).getTime()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime()

    let totalToday = 0, totalWeek = 0, totalMonth = 0
    logs.forEach((l: any) => {
        try {
            const s = new Date(l.start).getTime()
            const e = l.end ? new Date(l.end).getTime() : null
            const dur = (e || now.getTime()) - s
            if (s >= startOfDay) totalToday += dur
            if (s >= startOfWeek) totalWeek += dur
            if (s >= startOfMonth) totalMonth += dur
        } catch { }
    })

    // include in-progress
    const inProgress = sessionStorage.getItem('timesheet:inprogress')
    if (inProgress) {
        try {
            const s = new Date(inProgress).getTime()
            const dur = now.getTime() - s
            if (s >= startOfDay) totalToday += dur
            if (s >= startOfWeek) totalWeek += dur
            if (s >= startOfMonth) totalMonth += dur
        } catch { }
    }

    function fmt(ms: number) {
        const totalSec = Math.floor(ms / 1000)
        const hh = Math.floor(totalSec / 3600)
        const mm = Math.floor((totalSec % 3600) / 60)
        return `${hh}h ${mm}m`
    }

    return (
        <div className="container dashboard-classic">
            <div className="dashboard-header">
                <div>
                    <h2>Classic Dashboard</h2>
                    <p className="muted">Overview of activity and quick actions.</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={go('/timesheets')}>New timesheet</button>
                    <button className="btn btn-outline" onClick={go('/leave')}>New leave</button>
                </div>
            </div>

            <div className="grid cols-3 mb-3">
                <div className="metric card">
                    <div className="label">Today</div>
                    <div className="value">{fmt(totalToday)}</div>
                </div>
                <div className="metric card">
                    <div className="label">This week</div>
                    <div className="value">{fmt(totalWeek)}</div>
                </div>
                <div className="metric card">
                    <div className="label">This month</div>
                    <div className="value">{fmt(totalMonth)}</div>
                </div>

                <div className="metric card">
                    <div className="label">Leaves by status</div>
                    <div className="value">{prettyCount(leaves)}</div>
                    <div className="muted mt-1" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Sparkline data={new Array(6).fill(0).map((_, i) => Math.max(0, prettyCount(leaves) - i))} />
                        <div style={{ width: 80 }}><PieChart slices={leavesByStatus} size={80} /></div>
                    </div>
                </div>
                <div className="metric card">
                    <div className="label">Claims by status</div>
                    <div className="value">{prettyCount(claims)}</div>
                    <div className="muted mt-1" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Sparkline data={new Array(6).fill(0).map((_, i) => Math.max(0, prettyCount(claims) - i))} />
                        <div style={{ width: 80 }}><PieChart slices={claimsByStatus} size={80} /></div>
                    </div>
                </div>
            </div>

            <div className="grid cols-3 gap-2">
                <div className="card chart-card col-span-2">
                    <div className="chart-head">
                        <h3>Timesheet trends</h3>
                        <div className="muted">Last 30 days</div>
                    </div>
                    <div className="chart-placeholder">
                        {/* build 30-day timeseries */}
                        {(() => {
                            const days = 30
                            const arr = new Array(days).fill(0)
                            const msInDay = 24 * 3600 * 1000
                            for (const l of logs) {
                                try {
                                    const s = new Date(l.start).getTime()
                                    const e = l.end ? new Date(l.end).getTime() : Date.now()
                                    // accumulate by start-date bucket (simple)
                                    const idx = Math.floor((Date.now() - s) / msInDay)
                                    const pos = days - 1 - idx
                                    if (pos >= 0 && pos < days) arr[pos] += (e - s) / 3600000
                                } catch { }
                            }
                            // include in-progress
                            const inP = sessionStorage.getItem('timesheet:inprogress')
                            if (inP) {
                                try { const s = new Date(inP).getTime(); const idx = Math.floor((Date.now() - s) / msInDay); const pos = days - 1 - idx; if (pos >= 0 && pos < days) arr[pos] += (Date.now() - s) / 3600000 } catch { }
                            }
                            return <AreaChart data={arr} width={680} height={220} />
                        })()}
                    </div>
                    <div className="chart-actions">
                        <button className="btn btn-sm btn-outline">Export</button>
                    </div>
                </div>

                <div className="card activity-card">
                    <h3>Recent activity</h3>
                    <div className="activity-list">
                        <RecentList items={logs.map((l: any) => ({ date: new Date(l.start).toLocaleString(), type: 'Timesheet' }))} fields={['date', 'type']} noneText="No recent activity" />
                    </div>
                    <div className="mt-2">
                        <button className="btn btn-sm btn-primary" onClick={go('/timesheets')}>View all activity</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


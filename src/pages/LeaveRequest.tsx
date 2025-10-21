import React, { useState, useEffect } from 'react'
import Sparkline from '../components/Sparkline'

type LeaveItem = {
    id: string
    date: string
    type: string
    manager: string
    notes?: string
    status?: string
}

function loadLeaves() {
    try { return JSON.parse(localStorage.getItem('timesheet:leaves') || '[]') as LeaveItem[] } catch { return [] }
}

function saveLeaves(items: LeaveItem[]) {
    localStorage.setItem('timesheet:leaves', JSON.stringify(items))
}

const managers = [
    { id: 'm1', name: 'Alice Johnson' },
    { id: 'm2', name: 'Bob Smith' },
    { id: 'm3', name: 'Clara Lee' }
]

export default function LeaveRequest() {
    const [leaves, setLeaves] = useState<LeaveItem[]>(() => loadLeaves())
    const [date, setDate] = useState('')
    const [type, setType] = useState('Annual')
    const [manager, setManager] = useState(managers[0].id)
    const [notes, setNotes] = useState('')

    useEffect(() => {
        saveLeaves(leaves)
    }, [leaves])

    // Leave metrics
    const ALLOWANCE = 15
    const appliedCount = leaves.length
    const pendingCount = leaves.filter(l => l.status === 'Pending').length
    const usedCount = leaves.filter(l => l.type === 'Annual' && l.status === 'Approved').length

    // simple recent data: number of applications over last 6 entries
    const recent = leaves.slice(0, 6).map(() => 1).reverse()

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const mgr = managers.find(m => m.id === manager)
        const item: LeaveItem = {
            id: Date.now().toString(),
            date,
            type,
            manager: mgr ? mgr.name : manager,
            notes,
            status: 'Pending'
        }
        setLeaves(prev => [item, ...prev])
        setDate('')
        setType('Annual')
        setManager(managers[0].id)
        setNotes('')
    }

    return (
        <div className="container">
            <h2>Leave Request</h2>

            <div className="card mb-2">
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div className="label">Allowance</div>
                        <div className="value">{ALLOWANCE} days</div>
                    </div>
                    <div>
                        <div className="label">Used</div>
                        <div className="value">{usedCount} days</div>
                    </div>
                    <div>
                        <div className="label">Applied</div>
                        <div className="value">{appliedCount}</div>
                    </div>
                    <div>
                        <div className="label">Pending</div>
                        <div className="value">{pendingCount}</div>
                    </div>
                    <div style={{ width: 140 }}><Sparkline data={recent} /></div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                            <label>Date</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                        </div>
                        <div>
                            <label>Type</label>
                            <select value={type} onChange={e => setType(e.target.value)}>
                                <option>Annual</option>
                                <option>Sick</option>
                                <option>Unpaid</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label>Manager</label>
                        <select value={manager} onChange={e => setManager(e.target.value)}>
                            {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label>Notes</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-primary" type="submit">Submit request</button>
                        <button className="btn btn-outline" type="button" onClick={() => { setDate(''); setType('Annual'); setManager(managers[0].id); setNotes('') }}>Reset</button>
                    </div>
                </form>
            </div>

            <div className="card">
                <h3>Your requests</h3>
                {leaves.length === 0 ? (
                    <div className="muted">No data found</div>
                ) : (
                    <table className="table">
                        <thead><tr><th>Date</th><th>Type</th><th>Manager</th><th>Status</th></tr></thead>
                        <tbody>
                            {leaves.map(l => (
                                <tr key={l.id}><td>{l.date}</td><td>{l.type}</td><td>{l.manager}</td><td>{l.status}</td></tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

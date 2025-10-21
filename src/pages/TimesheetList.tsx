import React from 'react'
import TimePunch from '../components/TimePunch'

function loadLogs() {
    try { return JSON.parse(localStorage.getItem('timesheet:logs') || '[]') } catch { return [] }
}

export default function TimesheetList() {
    const logs = loadLogs()
    return (
        <div className="container">
            <h2>Timesheet Entries</h2>
            <div className="card mb-2">
                <h3>Quick punch</h3>
                <TimePunch />
            </div>
            {logs.length === 0 ? (
                <div className="muted">No data found</div>
            ) : (
                <table className="table">
                    <thead><tr><th>From</th><th>To</th></tr></thead>
                    <tbody>
                        {logs.map((l: any, i: number) => <tr key={i}><td>{new Date(l.start).toLocaleString()}</td><td>{l.end ? new Date(l.end).toLocaleString() : '-'}</td></tr>)}
                    </tbody>
                </table>
            )}
        </div>
    )
}

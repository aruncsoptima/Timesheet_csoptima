import React, { useEffect, useState, useRef } from 'react'

type Log = { start: string; end?: string }

const STORAGE_KEY = 'timesheet:logs'

function loadLogs(): Log[] {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Log[]
    } catch {
        return []
    }
}

function saveLog(log: Log) {
    const existing = loadLogs()
    existing.unshift(log)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 50)))
}

function shortTimestamp(iso?: string) {
    if (!iso) return '-'
    const d = new Date(iso)
    return d.toLocaleString()
}

export default function TimePunch() {
    const [running, setRunning] = useState(false)
    const [startTime, setStartTime] = useState<string | null>(null)
    const [elapsed, setElapsed] = useState(0)
    const [logs, setLogs] = useState<Log[]>(() => loadLogs())
    const timerRef = useRef<number | null>(null)

    useEffect(() => {
        // restore state if in progress
        const inProgress = sessionStorage.getItem('timesheet:inprogress')
        if (inProgress) {
            setRunning(true)
            setStartTime(inProgress)
        }
    }, [])

    useEffect(() => {
        if (running && startTime) {
            timerRef.current = window.setInterval(() => {
                setElapsed(Date.now() - new Date(startTime).getTime())
            }, 1000)
        }
        return () => {
            if (timerRef.current) window.clearInterval(timerRef.current)
        }
    }, [running, startTime])

    function formatDuration(ms: number) {
        const s = Math.floor(ms / 1000)
        const hh = Math.floor(s / 3600)
        const mm = Math.floor((s % 3600) / 60)
        const ss = s % 60
        return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
    }

    const onSignIn = () => {
        const now = new Date().toISOString()
        setStartTime(now)
        setRunning(true)
        sessionStorage.setItem('timesheet:inprogress', now)
        setElapsed(0)
    }

    const onSignOut = () => {
        if (!startTime) return
        const end = new Date().toISOString()
        const log = { start: startTime, end }
        saveLog(log)
        setLogs(loadLogs())
        sessionStorage.removeItem('timesheet:inprogress')
        setRunning(false)
        setStartTime(null)
        setElapsed(0)
        // nicer inline confirmation
        // keep alert for now
        alert(`Time logged from ${shortTimestamp(log.start)} to ${shortTimestamp(log.end)}`)
    }

    return (
        <div className="card punch-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div className="muted">Current status</div>
                    {running && startTime ? (
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                            <div style={{ fontWeight: 700 }}>{shortTimestamp(startTime)}</div>
                            <div className="muted">Elapsed: {formatDuration(elapsed)}</div>
                        </div>
                    ) : (
                        <div style={{ fontWeight: 700 }}>Not signed in</div>
                    )}
                </div>

                <div style={{ textAlign: 'right' }}>
                    <button
                        className={running ? 'punch-button punch-stop' : 'punch-button punch-start'}
                        onClick={() => (running ? onSignOut() : onSignIn())}
                        aria-pressed={running}
                    >
                        {running ? (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                                    <rect x="6" y="6" width="12" height="12" rx="2" fill="white" />
                                </svg>
                                &nbsp;Sign out
                            </>
                        ) : (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                                    <circle cx="12" cy="12" r="9" fill="white" />
                                </svg>
                                &nbsp;Sign in
                            </>
                        )}
                        {running && <span className="pulse" aria-hidden />}
                    </button>
                </div>
            </div>

            <hr style={{ margin: '1rem 0' }} />

            <div>
                <div className="muted mb-1">Recent logs</div>
                {logs.length === 0 ? (
                    <div className="muted">No logs yet</div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>From</th>
                                <th>To</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.slice(0, 10).map((l, i) => (
                                <tr key={i}>
                                    <td>{shortTimestamp(l.start)}</td>
                                    <td>{shortTimestamp(l.end)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

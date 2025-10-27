import React, { useEffect, useState, useRef } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Divider,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from '@mui/material';

type Log = { start: string; end?: string };

const STORAGE_KEY = 'timesheet:logs';

function loadLogs(): Log[] {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Log[];
    } catch {
        return [];
    }
}

function saveLog(log: Log) {
    const existing = loadLogs();
    existing.unshift(log);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 50)));
}

function shortTimestamp(iso?: string) {
    if (!iso) return '-';
    const d = new Date(iso);
    return d.toLocaleString();
}

export default function TimePunch() {
    const [running, setRunning] = useState(false);
    const [startTime, setStartTime] = useState<string | null>(null);
    const [elapsed, setElapsed] = useState(0);
    const [logs, setLogs] = useState<Log[]>(() => loadLogs());
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        const inProgress = sessionStorage.getItem('timesheet:inprogress');
        if (inProgress) {
            setRunning(true);
            setStartTime(inProgress);
        }
    }, []);

    useEffect(() => {
        if (running && startTime) {
            timerRef.current = window.setInterval(() => {
                setElapsed(Date.now() - new Date(startTime).getTime());
            }, 1000);
        }
        return () => {
            if (timerRef.current) window.clearInterval(timerRef.current);
        };
    }, [running, startTime]);

    function formatDuration(ms: number) {
        const s = Math.floor(ms / 1000);
        const hh = Math.floor(s / 3600);
        const mm = Math.floor((s % 3600) / 60);
        const ss = s % 60;
        return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
    }

    const onSignIn = () => {
        const now = new Date().toISOString();
        setStartTime(now);
        setRunning(true);
        sessionStorage.setItem('timesheet:inprogress', now);
        setElapsed(0);
    };

    const onSignOut = () => {
        if (!startTime) return;
        const end = new Date().toISOString();
        const log = { start: startTime, end };
        saveLog(log);
        setLogs(loadLogs());
        sessionStorage.removeItem('timesheet:inprogress');
        setRunning(false);
        setStartTime(null);
        setElapsed(0);
        alert(`Time logged from ${shortTimestamp(log.start)} to ${shortTimestamp(log.end)}`);
    };

    return (
        <Card sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">Current status</Typography>
                        {running && startTime ? (
                            <Box display="flex" alignItems="baseline" gap={2}>
                                <Typography fontWeight="bold">{shortTimestamp(startTime)}</Typography>
                                <Typography color="text.secondary">Elapsed: {formatDuration(elapsed)}</Typography>
                            </Box>
                        ) : (
                            <Typography fontWeight="bold">Not signed in</Typography>
                        )}
                    </Box>

                    <Button
                        variant="contained"
                        color={running ? 'error' : 'success'}
                        onClick={running ? onSignOut : onSignIn}
                    >
                        {running ? 'Sign out' : 'Sign in'}
                    </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Recent logs</Typography>

                {logs.length === 0 ? (
                    <Typography color="text.secondary">No logs yet</Typography>
                ) : (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>From</TableCell>
                                <TableCell>To</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {logs.slice(0, 10).map((l, i) => (
                                <TableRow key={i}>
                                    <TableCell>{shortTimestamp(l.start)}</TableCell>
                                    <TableCell>{shortTimestamp(l.end)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}

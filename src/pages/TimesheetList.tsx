import React from 'react';
import {
    Box, Card, Typography, Table, TableBody,
    TableCell, TableHead, TableRow
} from '@mui/material';
import TimePunch from '../components/TimePunch';

function loadLogs() {
    try { return JSON.parse(localStorage.getItem('timesheet:logs') || '[]'); } catch { return []; }
}

export default function TimesheetList() {
    const logs = loadLogs();

    return (
        <Box p={3}>
            {/* Page Title */}
            <Typography variant="h5" gutterBottom>
                Timesheet Entries
            </Typography>

            {/* Quick Punch Section */}
            <Card sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Quick Punch
                </Typography>
                <TimePunch />
            </Card>

            {/* Logs Table or Empty State */}
            {logs.length === 0 ? (
                <Typography color="text.secondary">No data found</Typography>
            ) : (
                <Card sx={{ p: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>From</TableCell>
                                <TableCell>To</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {logs.map((l: any, i: number) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        {new Date(l.start).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        {l.end ? new Date(l.end).toLocaleString() : '-'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </Box>
    );
}

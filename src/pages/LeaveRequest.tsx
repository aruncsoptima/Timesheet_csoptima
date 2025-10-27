import React, { useState, useEffect } from 'react';
import {
    Box, Typography, TextField, Button,
    Card, Grid, FormControl, Select, MenuItem, InputLabel,
    Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';
import Sparkline from '../components/Sparkline';

type LeaveItem = {
    id: string;
    fromDate: string;
    toDate: string;
    leaveType: string;
    approver: string;
    reason?: string;
    status?: string;
    approverComments?: string;
};

function loadLeaves() {
    try { return JSON.parse(localStorage.getItem('timesheet:leaves') || '[]') as LeaveItem[]; } catch { return []; }
}

function saveLeaves(items: LeaveItem[]) {
    localStorage.setItem('timesheet:leaves', JSON.stringify(items));
}

const managers = [
    { id: 'm1', name: 'Alice Johnson' },
    { id: 'm2', name: 'Bob Smith' },
    { id: 'm3', name: 'Clara Lee' }
];

export default function LeaveRequest() {
    const [leaves, setLeaves] = useState<LeaveItem[]>(() => loadLeaves());

    // ✅ Updated State Variables
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [leaveType, setLeaveType] = useState('Casual Leave');
    const [approver, setApprover] = useState(managers[0].id);
    const [reason, setReason] = useState('');

    useEffect(() => {
        saveLeaves(leaves);
    }, [leaves]);

    const ALLOWANCE = 15;
    const appliedCount = leaves.length;
    const pendingCount = leaves.filter(l => l.status === 'Pending').length;
    const usedCount = leaves.filter(l => l.leaveType === 'Casual Leave' && l.status === 'Approved').length;
    const recent = leaves.slice(0, 6).map(() => 1).reverse();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const mgr = managers.find(m => m.id === approver);
        const newLeave: LeaveItem = {
            id: Date.now().toString(),
            fromDate,
            toDate,
            leaveType,
            approver: mgr ? mgr.name : approver,
            reason,
            status: 'Pending'
        };
        setLeaves(prev => [newLeave, ...prev]);

        // Reset fields
        setFromDate('');
        setToDate('');
        setLeaveType('Casual Leave');
        setApprover(managers[0].id);
        setReason('');
    }

    return (
        <Box p={3}>
            <Typography variant="h5" gutterBottom>Leave Request</Typography>

            <Card sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Typography variant="body2">Allowance</Typography>
                        <Typography variant="h6">{ALLOWANCE} days</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2">Used</Typography>
                        <Typography variant="h6">{usedCount} days</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2">Applied</Typography>
                        <Typography variant="h6">{appliedCount}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2">Pending</Typography>
                        <Typography variant="h6">{pendingCount}</Typography>
                    </Grid>
                    <Grid item sx={{ width: 140 }}>
                        <Sparkline data={recent} />
                    </Grid>
                </Grid>

                {/* ✅ Form Updated */}
                <Box component="form" onSubmit={handleSubmit} mt={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="From Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={fromDate}
                                onChange={e => setFromDate(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="To Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={toDate}
                                onChange={e => setToDate(e.target.value)}
                                required
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Leave Type</InputLabel>
                                <Select value={leaveType} label="Leave Type" onChange={e => setLeaveType(e.target.value)}>
                                    <MenuItem value="Casual Leave">Casual Leave</MenuItem>
                                    <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                                    <MenuItem value="Unpaid Leave">Unpaid Leave</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Approver</InputLabel>
                                <Select value={approver} label="Approver" onChange={e => setApprover(e.target.value)}>
                                    {managers.map(m => (
                                        <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Box mt={2}>
                        <TextField
                            label="Reason"
                            fullWidth
                            multiline
                            rows={3}
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                        />
                    </Box>

                    <Box mt={2} display="flex" gap={2}>
                        <Button type="submit" variant="contained">Submit Request</Button>
                        <Button type="button" variant="outlined"
                            onClick={() => { setFromDate(''); setToDate(''); setLeaveType('Casual Leave'); setApprover(managers[0].id); setReason(''); }}>
                            Reset
                        </Button>
                    </Box>
                </Box>
            </Card>

            {/* ✅ Updated Table */}
            <Card sx={{ p: 2 }}>
                <Typography variant="h6">Your Requests</Typography>
                {leaves.length === 0 ? (
                    <Typography color="text.secondary" sx={{ mt: 1 }}>No data found</Typography>
                ) : (
                    <Table sx={{ mt: 1 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>From</TableCell>
                                <TableCell>To</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Approver</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {leaves.map(l => (
                                <TableRow key={l.id}>
                                    <TableCell>{l.fromDate}</TableCell>
                                    <TableCell>{l.toDate}</TableCell>
                                    <TableCell>{l.leaveType}</TableCell>
                                    <TableCell>{l.approver}</TableCell>
                                    <TableCell>{l.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>
        </Box>
    );
}

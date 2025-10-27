import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Divider,
} from '@mui/material';
import TimePunch from '../components/TimePunch';
import Sparkline from '../components/Sparkline';
import PieChart from '../components/PieChart';
import AreaChart from '../components/AreaChart';

function safeParse(key: string) {
    try {
        return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
        return [];
    }
}

function prettyCount(arr: any[] | null | undefined) {
    return arr ? arr.length : 0;
}

type RecentListProps = {
    items: any[];
    fields?: string[];
    noneText?: string;
};

function RecentList({ items, fields = ['date'], noneText = 'No data found' }: RecentListProps) {
    if (!items || items.length === 0)
        return <Typography color="text.secondary">{noneText}</Typography>;
    return (
        <Box>
            {items.slice(0, 3).map((it: any, i: number) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    {fields.map((f, idx) => (
                        <Typography key={idx} variant="body2">{it[f] ?? ''}</Typography>
                    ))}
                </Box>
            ))}
        </Box>
    );
}

export default function Dashboard() {
    const navigate = useNavigate();
    const go = (path: string) => () => navigate(path);

    const logs = safeParse('timesheet:logs');
    const leaves = safeParse('timesheet:leaves');
    const claims = safeParse('timesheet:claims');

    const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];
    logs.forEach((l: any) => {
        try {
            const d = new Date(l.start);
            weekdayCounts[d.getDay()]++;
        } catch { }
    });

    const weekdaySlices = weekdayCounts.map((v, i) => ({
        value: v,
        label: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
    }));

    const leavesByStatus = ['Pending', 'Approved', 'Rejected'].map((s) => ({
        value: leaves.filter((l: any) => l.status === s).length,
        label: s,
    }));

    const claimsByStatus = ['Pending', 'Approved', 'Rejected'].map((s) => ({
        value: claims.filter((c: any) => c.status === s).length,
        label: s,
    }));

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek).getTime();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    let totalToday = 0,
        totalWeek = 0,
        totalMonth = 0;
    logs.forEach((l: any) => {
        try {
            const s = new Date(l.start).getTime();
            const e = l.end ? new Date(l.end).getTime() : null;
            const dur = (e || now.getTime()) - s;
            if (s >= startOfDay) totalToday += dur;
            if (s >= startOfWeek) totalWeek += dur;
            if (s >= startOfMonth) totalMonth += dur;
        } catch { }
    });

    const inProgress = sessionStorage.getItem('timesheet:inprogress');
    if (inProgress) {
        try {
            const s = new Date(inProgress).getTime();
            const dur = now.getTime() - s;
            if (s >= startOfDay) totalToday += dur;
            if (s >= startOfWeek) totalWeek += dur;
            if (s >= startOfMonth) totalMonth += dur;
        } catch { }
    }

    function fmt(ms: number) {
        const totalSec = Math.floor(ms / 1000);
        const hh = Math.floor(totalSec / 3600);
        const mm = Math.floor((totalSec % 3600) / 60);
        return `${hh}h ${mm}m`;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h4">Dashboard</Typography>
                    <Typography color="text.secondary">
                        Overview of activity and quick actions.
                    </Typography>
                </Box>
                <Box>
                    <Button variant="contained" sx={{ mr: 1 }} onClick={go('/timesheets')}>
                        New timesheet
                    </Button>
                    <Button variant="outlined" onClick={go('/leave')}>
                        New leave
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={2}>
                {[
                    { label: 'Today', value: fmt(totalToday) },
                    { label: 'This Week', value: fmt(totalWeek) },
                    { label: 'This Month', value: fmt(totalMonth) },
                ].map((metric, i) => (
                    <Grid item xs={12} md={4} key={i}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">{metric.label}</Typography>
                                <Typography variant="h5">{metric.value}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary">Leaves by status</Typography>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Typography variant="h6">{prettyCount(leaves)}</Typography>
                                <PieChart slices={leavesByStatus} size={80} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary">Claims by status</Typography>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Typography variant="h6">{prettyCount(claims)}</Typography>
                                <PieChart slices={claimsByStatus} size={80} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Timesheet trends</Typography>
                            <Divider sx={{ my: 1 }} />
                            <AreaChart data={weekdayCounts} width={600} height={200} />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Recent Activity</Typography>
                            <Divider sx={{ my: 1 }} />
                            <RecentList
                                items={logs.map((l: any) => ({
                                    date: new Date(l.start).toLocaleString(),
                                    type: 'Timesheet',
                                }))}
                                fields={['date', 'type']}
                                noneText="No recent activity"
                            />
                            <Button
                                size="small"
                                variant="contained"
                                sx={{ mt: 1 }}
                                onClick={go('/timesheets')}
                            >
                                View all activity
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

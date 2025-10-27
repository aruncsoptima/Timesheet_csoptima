import React, { useState } from "react";
import {
    Container,
    Card,
    CardContent,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Box,
    Alert,
} from "@mui/material";

function loadAttendance() {
    try {
        return JSON.parse(localStorage.getItem("attendance:logs") || "[]");
    } catch {
        return [];
    }
}

function saveAttendance(data: any) {
    localStorage.setItem("attendance:logs", JSON.stringify(data));
}

export default function Attendance() {
    const [status, setStatus] = useState("");
    const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
    const [logs, setLogs] = useState(loadAttendance());
    const [error, setError] = useState("");

    const handleSubmit = () => {
        setError("");

        if (!status) {
            setError("Please select attendance status");
            return;
        }
        if (!date) {
            setError("Please select a date");
            return;
        }

        const exists = logs.some((entry: any) => entry.date === date);
        if (exists) {
            setError(`Attendance for ${date} is already recorded.`);
            return;
        }

        const newEntry = { date, status };
        const updatedLogs = [...logs, newEntry];
        setLogs(updatedLogs);
        saveAttendance(updatedLogs);

        setStatus(""); // reset status
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Attendance
            </Typography>

            <Card sx={{ p: 2, mb: 3 }}>
                <CardContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        label="Date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                        InputLabelProps={{ shrink: true }}
                    />

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={status}
                            label="Status"
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <MenuItem value="">-- Choose --</MenuItem>
                            <MenuItem value="Present">Present</MenuItem>
                            <MenuItem value="Absent">Absent</MenuItem>
                            <MenuItem value="Leave">Leave</MenuItem>
                            <MenuItem value="Work From Home">Work From Home</MenuItem>
                            <MenuItem value="OD">On Duty (OD)</MenuItem>
                        </Select>
                    </FormControl>

                    <Button variant="contained" onClick={handleSubmit}>
                        Submit
                    </Button>
                </CardContent>
            </Card>

            <Typography variant="h5" gutterBottom>
                Previous Attendance
            </Typography>

            {logs.length === 0 ? (
                <Typography color="text.secondary">No records found</Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map((log: any, index: number) => (
                            <TableRow key={index}>
                                <TableCell>{log.date}</TableCell>
                                <TableCell>{log.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Container>
    );
}

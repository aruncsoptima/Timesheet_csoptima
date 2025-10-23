import React, { useState } from "react";

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
    const [date, setDate] = useState(new Date().toISOString().substring(0, 10)); // default = today
    const [logs, setLogs] = useState(loadAttendance());

    const handleSubmit = () => {
        if (!status) {
            alert("Please select attendance status");
            return;
        }
        if (!date) {
            alert("Please select a date");
            return;
        }

        // Check if record already exists for this date
        const exists = logs.some((entry: any) => entry.date === date);
        if (exists) {
            alert(`Attendance for ${date} is already recorded.`);
            return;
        }




        const newEntry = {
            date: date,
            status: status,
        };

        const updatedLogs = [...logs, newEntry];
        setLogs(updatedLogs);
        saveAttendance(updatedLogs);

        // Reset status after submit
        setStatus("");
    };

    return (
        <div className="container">
            <h2>Attendance</h2>
            <div className="card p-3 mb-3">
                <label><strong>Date:</strong></label>
                <input
                    type="date"
                    className="form-control mb-2"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                <label><strong>Status:</strong></label>
                <select
                    className="form-select mb-2"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">-- Choose --</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Leave">Leave</option>
                    <option value="Work From Home">Work From Home</option>
                    <option value="OD">On Duty (OD)</option>
                </select>

                <button className="btn btn-primary" onClick={handleSubmit}>
                    Submit
                </button>
            </div>

            <h3>Previous Attendance</h3>
            {logs.length === 0 ? (
                <div className="muted">No records found</div>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log: any, index: number) => (
                            <tr key={index}>
                                <td>{log.date}</td>
                                <td>{log.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

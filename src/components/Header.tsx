import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export default function Header() {
    return (
        <AppBar position="static" color="primary">
            <Toolbar>

                {/* App Title */}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Timesheet
                </Typography>

                {/* Navigation Links */}
                <Box>
                    <Button color="inherit" component={Link} to="/">
                        Dashboard
                    </Button>
                    <Button color="inherit" component={Link} to="/timesheets">
                        Timesheets
                    </Button>
                    <Button color="inherit" component={Link} to="/leave">
                        Leave Request
                    </Button>
                    <Button color="inherit" component={Link} to="/expense">
                        Expense Claim
                    </Button>
                    <Button color="inherit" component={Link} to="/attendance">
                        Attendance
                    </Button>
                </Box>

            </Toolbar>
        </AppBar>
    );
}

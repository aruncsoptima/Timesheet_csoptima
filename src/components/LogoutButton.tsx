import React from 'react';
import Button from '@mui/material/Button';
import { useAuth } from '../auth/AuthProvider';

export default function LogoutButton() {
    const { signOut } = useAuth();

    return (
        <Button
            variant="contained"
            color="secondary"
            onClick={signOut}
        >
            Sign Out
        </Button>
    );
}

import React from 'react'
import { useAuth } from '../auth/AuthProvider'

export default function LogoutButton() {
    const { signOut } = useAuth()
    return <button onClick={() => signOut()}>Sign out</button>
}

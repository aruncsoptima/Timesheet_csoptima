import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
    return (
        <header className="site-header">
            <div className="container">
                <h1 style={{ display: 'inline-block' }}>Timesheet</h1>
                <nav style={{ float: 'right' }}>
                    <Link to="/">Dashboard</Link>
                    {' | '}
                    <Link to="/timesheets">Timesheets</Link>
                    {' | '}
                    <Link to="/leave">Leave Request</Link>
                    {' | '}
                    <Link to="/expense">Expense Claim</Link>
                </nav>
            </div>
        </header>
    )
}

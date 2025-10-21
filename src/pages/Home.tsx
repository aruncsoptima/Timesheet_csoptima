import React from 'react'
import TimePunch from '../components/TimePunch'

export default function Home() {
    return (
        <section className="home container">
            <h2>Welcome to Timesheet</h2>
            <p>This is a minimal frontend scaffold. Connect a backend later via <code>VITE_API_BASE</code>.</p>
            <hr />
            <TimePunch />
        </section>
    )
}

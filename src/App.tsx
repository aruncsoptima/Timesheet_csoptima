import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import TimesheetList from './pages/TimesheetList'
import LeaveRequest from './pages/LeaveRequest'
import ExpenseClaim from './pages/ExpenseClaim'

export default function App() {
    return (
        <BrowserRouter>
            <div className="app-root">
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/timesheets" element={<TimesheetList />} />
                        <Route path="/leave" element={<LeaveRequest />} />
                        <Route path="/expense" element={<ExpenseClaim />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    )
}

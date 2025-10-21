import React, { useState } from 'react'

type Entry = {
    id?: string
    date: string
    project: string
    hours: number
    notes?: string
}

export default function EntryForm({ existing }: { existing?: Entry }) {
    const [date, setDate] = useState(existing?.date || '')
    const [project, setProject] = useState(existing?.project || '')
    const [hours, setHours] = useState(existing?.hours || 0)
    const [notes, setNotes] = useState(existing?.notes || '')

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const payload: Entry = { id: existing?.id, date, project, hours, notes }
        // TODO: call API to create/update entry
        console.log('submit entry', payload)
        alert('Entry saved (stub)')
    }

    return (
        <div className="container">
            <h2>{existing ? 'Edit Entry' : 'New Entry'}</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                </div>
                <div>
                    <label>Project</label>
                    <input value={project} onChange={e => setProject(e.target.value)} required />
                </div>
                <div>
                    <label>Hours</label>
                    <input type="number" value={hours} onChange={e => setHours(Number(e.target.value))} min={0} step={0.25} required />
                </div>
                <div>
                    <label>Notes</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
                <button type="submit">Save</button>
            </form>
        </div>
    )
}

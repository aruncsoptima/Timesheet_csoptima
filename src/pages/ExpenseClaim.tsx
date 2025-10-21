import React, { useState, useEffect } from 'react'

type ClaimItem = {
    id: string
    date: string
    category: string
    amount: number
    notes?: string
    invoice?: string // data URL
    status?: string
}

function loadClaims() {
    try { return JSON.parse(localStorage.getItem('timesheet:claims') || '[]') as ClaimItem[] } catch { return [] }
}

function saveClaims(items: ClaimItem[]) { localStorage.setItem('timesheet:claims', JSON.stringify(items)) }

export default function ExpenseClaim() {
    const [claims, setClaims] = useState<ClaimItem[]>(() => loadClaims())
    const [date, setDate] = useState('')
    const [category, setCategory] = useState('Travel')
    const [amount, setAmount] = useState<number | ''>('')
    const [notes, setNotes] = useState('')
    const [invoiceData, setInvoiceData] = useState<string | undefined>(undefined)

    useEffect(() => { saveClaims(claims) }, [claims])

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files && e.target.files[0]
        if (!f) return setInvoiceData(undefined)
        const reader = new FileReader()
        reader.onload = () => setInvoiceData(reader.result as string)
        reader.readAsDataURL(f)
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const item: ClaimItem = {
            id: Date.now().toString(),
            date,
            category,
            amount: typeof amount === 'number' ? amount : parseFloat(String(amount) || '0'),
            notes,
            invoice: invoiceData,
            status: 'Pending'
        }
        setClaims(prev => [item, ...prev])
        setDate('')
        setCategory('Travel')
        setAmount('')
        setNotes('')
        setInvoiceData(undefined)
    }

    return (
        <div className="container">
            <h2>Expense Claim</h2>

            <div className="card mb-2">
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
                        <div>
                            <label>Date</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                        </div>
                        <div>
                            <label>Category</label>
                            <select value={category} onChange={e => setCategory(e.target.value)}>
                                <option>Travel</option>
                                <option>Meals</option>
                                <option>Supplies</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
                        <div>
                            <label>Amount</label>
                            <input type="number" step="0.01" value={amount as any} onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))} required />
                        </div>
                        <div>
                            <label>Invoice (optional)</label>
                            <input type="file" accept="image/*,.pdf" onChange={handleFile} />
                        </div>
                    </div>

                    <div>
                        <label>Notes</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} />
                    </div>

                    <div style={{ display: 'flex', gap: '.5rem' }}>
                        <button className="btn btn-primary" type="submit">Submit claim</button>
                        <button className="btn btn-outline" type="button" onClick={() => { setDate(''); setCategory('Travel'); setAmount(''); setNotes(''); setInvoiceData(undefined) }}>Reset</button>
                    </div>
                </form>
            </div>

            <div className="card">
                <h3>Your claims</h3>
                {claims.length === 0 ? (
                    <div className="muted">No data found</div>
                ) : (
                    <table className="table">
                        <thead><tr><th>Date</th><th>Category</th><th>Amount</th><th>Invoice</th><th>Status</th></tr></thead>
                        <tbody>
                            {claims.map(c => (
                                <tr key={c.id}>
                                    <td>{c.date}</td>
                                    <td>{c.category}</td>
                                    <td>{c.amount.toFixed(2)}</td>
                                    <td>{c.invoice ? <a href={c.invoice} target="_blank" rel="noreferrer">View</a> : '—'}</td>
                                    <td>{c.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

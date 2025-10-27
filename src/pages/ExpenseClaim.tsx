import React, { useState, useEffect } from 'react';
import {
    Container,
    Card,
    CardContent,
    TextField,
    Button,
    Grid,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Box
} from '@mui/material';

type ClaimItem = {
    id: string;
    date: string;
    category: string;
    amount: number;
    notes?: string;
    invoice?: string;
    status?: string;
};

function loadClaims() {
    try { return JSON.parse(localStorage.getItem('timesheet:claims') || '[]') as ClaimItem[] } catch { return [] }
}

function saveClaims(items: ClaimItem[]) {
    localStorage.setItem('timesheet:claims', JSON.stringify(items));
}

export default function ExpenseClaim() {
    const [claims, setClaims] = useState<ClaimItem[]>(loadClaims);
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('Travel');
    const [amount, setAmount] = useState<number | ''>('');
    const [notes, setNotes] = useState('');
    const [invoiceData, setInvoiceData] = useState<string | undefined>(undefined);

    useEffect(() => { saveClaims(claims) }, [claims]);

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return setInvoiceData(undefined);
        const reader = new FileReader();
        reader.onload = () => setInvoiceData(reader.result as string);
        reader.readAsDataURL(file);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const newClaim: ClaimItem = {
            id: Date.now().toString(),
            date,
            category,
            amount: typeof amount === 'number' ? amount : parseFloat(String(amount) || '0'),
            notes,
            invoice: invoiceData,
            status: 'Pending'
        };
        setClaims(prev => [newClaim, ...prev]);
        setDate('');
        setCategory('Travel');
        setAmount('');
        setNotes('');
        setInvoiceData(undefined);
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Expense Claim</Typography>

            {/* ✅ Form Section */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={category}
                                        label="Category"
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <MenuItem value="Travel">Travel</MenuItem>
                                        <MenuItem value="Meals">Meals</MenuItem>
                                        <MenuItem value="Supplies">Supplies</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Amount"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Button variant="outlined" component="label" fullWidth sx={{ mt: 1 }}>
                                    Upload Invoice (optional)
                                    <input type="file" hidden accept="image/*,.pdf" onChange={handleFile} />
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Notes"
                                    multiline
                                    rows={3}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
                                <Button variant="contained" type="submit">Submit Claim</Button>
                                <Button variant="outlined" type="button" onClick={() => {
                                    setDate('');
                                    setCategory('Travel');
                                    setAmount('');
                                    setNotes('');
                                    setInvoiceData(undefined);
                                }}>Reset</Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>

            {/* ✅ Claims Table Section */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Your Claims</Typography>
                    {claims.length === 0 ? (
                        <Typography color="text.secondary">No data found</Typography>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Invoice</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {claims.map(c => (
                                    <TableRow key={c.id}>
                                        <TableCell>{c.date}</TableCell>
                                        <TableCell>{c.category}</TableCell>
                                        <TableCell>{c.amount.toFixed(2)}</TableCell>
                                        <TableCell>
                                            {c.invoice ? <a href={c.invoice} target="_blank" rel="noreferrer">View</a> : '—'}
                                        </TableCell>
                                        <TableCell>{c.status}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
}

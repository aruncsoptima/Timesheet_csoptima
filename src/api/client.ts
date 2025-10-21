const API_BASE = import.meta.env.VITE_API_BASE || ''

export async function fetchPing() {
    const res = await fetch(`${API_BASE}/ping`)
    return res.json()
}

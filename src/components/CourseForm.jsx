import { useState } from 'react'

export default function CourseForm({ onCreated }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [form, setForm] = useState({
    creator_id: '',
    title: '',
    description: '',
    price_usd: 0,
    category: '',
    cover_image_url: '',
    token_symbol: 'CTKN',
    token_supply: 100000,
    treasury_eth_address: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: name === 'price_usd' || name === 'token_supply' ? Number(value) : value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) {
        onCreated?.(data.id)
        setForm({
          creator_id: '', title: '', description: '', price_usd: 0, category: '', cover_image_url: '', token_symbol: 'CTKN', token_supply: 100000, treasury_eth_address: ''
        })
      } else {
        alert(data.detail || 'Failed to create course')
      }
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-blue-100">
      <div className="grid grid-cols-2 gap-3">
        <input name="creator_id" value={form.creator_id} onChange={handleChange} placeholder="Creator ID" className="px-3 py-2 rounded bg-slate-900 border border-slate-700" />
        <input name="title" value={form.title} onChange={handleChange} placeholder="Course Title" className="px-3 py-2 rounded bg-slate-900 border border-slate-700" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="px-3 py-2 rounded bg-slate-900 border border-slate-700" />
        <input name="price_usd" type="number" value={form.price_usd} onChange={handleChange} placeholder="Price (USD)" className="px-3 py-2 rounded bg-slate-900 border border-slate-700" />
        <input name="token_symbol" value={form.token_symbol} onChange={handleChange} placeholder="Token Symbol" className="px-3 py-2 rounded bg-slate-900 border border-slate-700" />
        <input name="token_supply" type="number" value={form.token_supply} onChange={handleChange} placeholder="Token Supply" className="px-3 py-2 rounded bg-slate-900 border border-slate-700" />
        <input name="treasury_eth_address" value={form.treasury_eth_address} onChange={handleChange} placeholder="Treasury ETH Address" className="px-3 py-2 rounded bg-slate-900 border border-slate-700 col-span-2" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="px-3 py-2 rounded bg-slate-900 border border-slate-700 col-span-2" />
        <input name="cover_image_url" value={form.cover_image_url} onChange={handleChange} placeholder="Cover Image URL" className="px-3 py-2 rounded bg-slate-900 border border-slate-700 col-span-2" />
      </div>
      <button disabled={loading} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50">{loading ? 'Creating...' : 'Create Course'}</button>
    </form>
  )
}

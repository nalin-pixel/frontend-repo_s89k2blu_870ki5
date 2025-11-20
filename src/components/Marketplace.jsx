import { useEffect, useState } from 'react'

export default function Marketplace({ currentUser }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [courses, setCourses] = useState([])
  const [orders, setOrders] = useState([])

  const load = async () => {
    const res = await fetch(`${baseUrl}/api/courses`)
    const data = await res.json()
    setCourses(data)
  }

  const loadOrders = async (courseId) => {
    const res = await fetch(`${baseUrl}/api/orders?course_id=${courseId}`)
    const data = await res.json()
    setOrders(data)
  }

  const purchase = async (courseId) => {
    if (!currentUser) return alert('Load a user first')
    const res = await fetch(`${baseUrl}/api/courses/${courseId}/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: currentUser._id })
    })
    const data = await res.json()
    if (!res.ok) return alert(data.detail || 'Failed')
    alert(`Purchased! Tokens awarded: ${data.tokens_awarded}`)
  }

  const placeOrder = async (courseId, side) => {
    if (!currentUser) return alert('Load a user first')
    const price = Number(prompt('Price (USD)'))
    const amount = Number(prompt('Amount'))
    if (!price || !amount) return
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course_id: courseId, user_id: currentUser._id, side, price_usd: price, amount })
    })
    const data = await res.json()
    if (!res.ok) return alert(data.detail || 'Failed')
    alert('Order placed')
    loadOrders(courseId)
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Courses</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {courses.map(c => (
          <div key={c._id} className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 text-blue-100">
            <div className="flex items-center gap-3">
              {c.cover_image_url && <img src={c.cover_image_url} className="w-16 h-16 object-cover rounded" />}
              <div>
                <div className="text-white font-semibold">{c.title}</div>
                <div className="text-sm text-blue-300/80">${'{'}c.price_usd{'}'} • {c.category || 'General'}</div>
                <div className="text-xs text-blue-300/60">Token: {c.token_symbol}</div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => purchase(c._id)} className="px-3 py-1 rounded bg-green-600 hover:bg-green-500">Buy Course</button>
              <button onClick={() => placeOrder(c._id, 'buy')} className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500">Bid Token</button>
              <button onClick={() => placeOrder(c._id, 'sell')} className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500">Ask Token</button>
              <button onClick={() => loadOrders(c._id)} className="px-3 py-1 rounded bg-slate-700">View Orders</button>
            </div>
          </div>
        ))}
      </div>

      {orders.length > 0 && (
        <div>
          <h3 className="text-xl text-white mb-2">Orderbook</h3>
          <div className="space-y-2">
            {orders.map(o => (
              <div key={o._id} className="flex items-center justify-between bg-slate-900/60 border border-slate-700 rounded p-2 text-sm">
                <span className={o.side === 'buy' ? 'text-green-400' : 'text-amber-300'}>{o.side.toUpperCase()}</span>
                <span className="text-blue-200">Price: ${'{'}o.price_usd{'}'}</span>
                <span className="text-blue-200">Amount: {o.amount}</span>
                <span className="text-blue-300/70">User: {o.user_id}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

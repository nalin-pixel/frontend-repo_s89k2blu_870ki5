import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import CourseForm from './components/CourseForm'
import Marketplace from './components/Marketplace'

function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [currentUser, setCurrentUser] = useState(null)
  const [balances, setBalances] = useState([])

  const loadUser = async (userId) => {
    if (!userId) return
    const res = await fetch(`${baseUrl}/api/users`)
    const users = await res.json()
    const u = users.find(x => x._id === userId)
    if (!u) return alert('User not found. Create one via API or use a valid id.')
    setCurrentUser(u)
    loadBalances(userId)
  }

  const loadBalances = async (userId) => {
    const res = await fetch(`${baseUrl}/api/balances/${userId}`)
    const data = await res.json()
    setBalances(data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar currentUser={currentUser} onSwitchUser={loadUser} />

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-white text-2xl font-semibold mb-4">Create a Course</h2>
          <CourseForm onCreated={(id) => alert(`Course created: ${id}`)} />
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <Marketplace currentUser={currentUser} />
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-blue-100">
          <h2 className="text-white text-2xl font-semibold mb-4">Your Token Balances</h2>
          {balances.length === 0 ? (
            <p className="text-blue-300/70">No balances yet</p>
          ) : (
            <div className="space-y-2">
              {balances.map(b => (
                <div key={b._id} className="flex items-center justify-between bg-slate-900/60 border border-slate-700 rounded p-2 text-sm">
                  <span className="text-blue-200">Course: {b.course_id}</span>
                  <span className="text-blue-200">Amount: {b.amount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

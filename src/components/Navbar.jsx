import { useState } from 'react'

export default function Navbar({ currentUser, onSwitchUser }) {
  const [userIdInput, setUserIdInput] = useState('')

  return (
    <div className="sticky top-0 z-10 backdrop-blur bg-slate-900/60 border-b border-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/flame-icon.svg" alt="logo" className="w-8 h-8" />
          <span className="font-semibold">Course Token Market</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-blue-200/80">User:</span>
          <span className="px-2 py-1 rounded bg-slate-800 text-blue-200 text-sm max-w-[220px] truncate">
            {currentUser?.name ? `${currentUser.name} (${currentUser.role})` : 'None'}
          </span>
          <input
            value={userIdInput}
            onChange={(e) => setUserIdInput(e.target.value)}
            placeholder="Enter user id"
            className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => onSwitchUser(userIdInput)}
            className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-sm"
          >
            Load User
          </button>
        </div>
      </div>
    </div>
  )
}

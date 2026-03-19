'use client';

import { LayoutDashboard, PlusCircle, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Sidebar({ view, onNavigate }) {
  const [open, setOpen] = useState(false)

  const active = view === 'dashboard' ? 'dashboard' : 'form'

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'form', label: 'Nuevo ticket', icon: PlusCircle },
  ]

  const NavContent = () => (
    <>
      <div className="flex items-center gap-3 px-4 py-6 border-b border-slate-800">
        <div className="bg-white text-slate-900 w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg shadow">
          W
        </div>
        <div>
          <p className="font-black text-white text-sm leading-tight">WASHMASTER</p>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Express</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { onNavigate(key); setOpen(false) }}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all text-left w-full ${
              active === key
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>
    </>
  )

  return (
    <>
      <aside className="hidden md:flex flex-col w-56 min-h-screen bg-slate-900 fixed left-0 top-0 z-30">
        <NavContent />
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-slate-900 flex items-center justify-between px-4 py-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="bg-white text-slate-900 w-8 h-8 rounded-xl flex items-center justify-center font-black text-base">
            W
          </div>
          <span className="font-black text-white text-sm">WASHMASTER</span>
        </div>
        <button onClick={() => setOpen(true)} className="text-slate-400 hover:text-white">
          <Menu size={22} />
        </button>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-slate-900 h-full z-50">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <NavContent />
          </aside>
        </div>
      )}
    </>
  )
}
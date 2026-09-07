import { NavLink } from 'react-router-dom'
import { Home, Inbox, Settings, X } from 'lucide-react'
import type { Category, Session } from '../types'

interface SidebarProps {
  open: boolean
  onClose: () => void
  categories: Category[]
  recentSessions: Session[]
}

export default function Sidebar({ open, onClose, categories, recentSessions }: SidebarProps) {
  const learning = categories.filter((c) => c.groupName === 'LEARNING')
  const other = categories.filter((c) => c.groupName !== 'LEARNING')

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors border-l-2 ${
      isActive
        ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300 font-medium'
        : 'border-transparent text-muted-300 hover:bg-night-700 hover:text-white'
    }`

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-night-950/70 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-night-500 bg-night-900 shadow-[8px_0_40px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-night-500 px-4 py-4">
          <span className="text-lg font-extrabold tracking-tight">
            <span className="text-white">CSE </span>
            <span className="text-cyan-400">HUB</span>
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-full p-1.5 text-muted-400 hover:bg-night-700 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <NavLink to="/" end onClick={onClose} className={linkClass}>
            <Home size={17} /> Home
          </NavLink>

          <p className="mb-1 mt-5 px-3 text-xs font-semibold uppercase tracking-wider text-muted-500">
            Learning
          </p>
          {learning.map((c) => (
            <NavLink key={c.id} to={`/category/${c.id}`} onClick={onClose} className={linkClass}>
              <span>{c.icon}</span> {c.name}
            </NavLink>
          ))}

          <div className="my-4 border-t border-night-500" />

          {other.map((c) => (
            <NavLink key={c.id} to={`/category/${c.id}`} onClick={onClose} className={linkClass}>
              <span>{c.icon}</span> {c.name}
            </NavLink>
          ))}

          {other.length === 0 && learning.length === 0 && (
            <NavLink to="/" onClick={onClose} className={linkClass}>
              <Inbox size={17} /> Inbox
            </NavLink>
          )}

          <div className="my-4 border-t border-night-500" />

          <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-500">
            💬 Sessions
          </p>
          <NavLink to="/sessions" onClick={onClose} className={linkClass}>
            View all sessions
          </NavLink>
          {recentSessions.slice(0, 6).map((s) => (
            <NavLink key={s.id} to={`/sessions/${s.id}`} onClick={onClose} className={linkClass}>
              <span className="truncate">{s.title}</span>
            </NavLink>
          ))}

          <div className="my-4 border-t border-night-500" />

          <NavLink to="/settings" onClick={onClose} className={linkClass}>
            <Settings size={17} /> Customize CSE Hub
          </NavLink>
        </nav>
      </aside>
    </>
  )
}

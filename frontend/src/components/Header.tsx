import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Plus, Search } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
  onAddClick: () => void
}

export default function Header({ onMenuClick, onAddClick }: HeaderProps) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-night-500 bg-night-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3.5 sm:px-6">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="rounded-lg p-2 text-muted-300 transition-colors hover:bg-night-700 hover:text-white"
        >
          <Menu size={20} />
        </button>

        <span className="hidden shrink-0 text-lg font-extrabold tracking-tight sm:inline">
          <span className="text-white">CSE </span>
          <span className="text-cyan-400">HUB</span>
        </span>

        <form onSubmit={handleSearch} className="relative mx-auto w-full max-w-xl flex-1">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/80" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search resources, notes, tags…"
            className="w-full rounded-full border border-night-500 bg-night-800/80 py-2.5 pl-11 pr-4 text-sm text-ink placeholder:text-muted-500 outline-none transition-all focus:border-cyan-400/60 focus:shadow-glow"
          />
        </form>

        <div className="flex items-center gap-3">
          <button
            onClick={onAddClick}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-night-950 shadow-[0_0_18px_rgba(34,211,238,0.35)] transition-colors hover:bg-cyan-300"
          >
            <Plus size={16} /> <span className="hidden sm:inline">Add Resource</span>
          </button>

          <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-night-400 bg-night-700 text-xs font-semibold text-muted-300 sm:flex">
            KK
          </div>
        </div>
      </div>
    </header>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'
import AddSessionModal from '../components/AddSessionModal'
import { useSessions } from '../hooks/useSessions'
import { useCategories } from '../hooks/useCategories'

export default function SessionsPage() {
  const { sessions, loading, error, refresh } = useSessions()
  const { categories } = useCategories()
  const [addOpen, setAddOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">💬 Sessions</h1>
          <p className="mt-1 text-sm text-muted-400">Your saved notes, discussions and references.</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-night-950 hover:bg-cyan-300"
        >
          <Plus size={16} /> New Session
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-sm text-rust">{error}</p>
      ) : sessions.length === 0 ? (
        <EmptyState icon="💬" title="No sessions yet" description="Create your first note or saved discussion." />
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((s) => (
            <Link
              key={s.id}
              to={`/sessions/${s.id}`}
              className="flex items-center justify-between rounded-xl2 border border-night-500 bg-night-800 px-5 py-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-cyan-400/40 hover:shadow-cardHover"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-cyan-300">
                  <span>{s.categoryIcon}</span> {s.categoryName}
                </div>
                <h3 className="mt-1 text-base font-semibold text-ink">{s.title}</h3>
              </div>
              <span className="text-xs text-muted-500">
                {new Date(s.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </Link>
          ))}
        </div>
      )}

      <AddSessionModal open={addOpen} categories={categories} onClose={() => setAddOpen(false)} onSaved={refresh} />
    </div>
  )
}

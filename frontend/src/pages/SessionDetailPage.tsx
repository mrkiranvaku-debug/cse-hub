import { useEffect, useState } from 'react'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import ConfirmDialog from '../components/ConfirmDialog'
import AddSessionModal from '../components/AddSessionModal'
import { sessionService } from '../services/sessionService'
import { useCategories } from '../hooks/useCategories'
import { useToast } from '../context/ToastContext'
import type { Session } from '../types'

export default function SessionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { categories } = useCategories()

  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  async function load() {
    if (!id) return
    setLoading(true)
    try {
      const data = await sessionService.getById(Number(id))
      setSession(data)
    } catch (err) {
      console.error(err)
      showToast('Could not load this session', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function handleDelete() {
    if (!session) return
    try {
      await sessionService.remove(session.id)
      showToast('Session deleted')
      navigate('/sessions')
    } catch (err) {
      console.error(err)
      showToast('Could not delete session', 'error')
    }
  }

  if (loading) return <Loading />
  if (!session) return <p className="text-sm text-muted-400">Session not found.</p>

  return (
    <div className="flex flex-col gap-6">
      <Link to="/sessions" className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-400 hover:text-white">
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="rounded-xl2 border border-night-500 bg-night-800 p-6 shadow-card sm:p-8">
        <div className="flex items-center gap-2 text-xs font-medium text-cyan-300">
          <span>{session.categoryIcon}</span> {session.categoryName}
        </div>

        <h1 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">{session.title}</h1>

        <p className="mt-1 text-xs text-muted-500">
          Created {new Date(session.createdAt).toLocaleDateString()} · Updated{' '}
          {new Date(session.updatedAt).toLocaleDateString()}
        </p>

        <div className="prose prose-invert prose-sm mt-6 max-w-none whitespace-pre-wrap leading-relaxed text-muted-200">
          {session.content || 'No content yet.'}
        </div>

        {session.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {session.tags.map((t) => (
              <span key={t} className="rounded-full border border-night-500 bg-night-700 px-2.5 py-1 text-xs text-cyan-300/90">
                #{t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-8 flex gap-3 border-t border-night-500 pt-6">
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 rounded-full border border-night-500 px-4 py-2 text-sm font-medium text-ink hover:bg-night-700"
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            onClick={() => setConfirmingDelete(true)}
            className="flex items-center gap-1.5 rounded-full border border-rust/30 px-4 py-2 text-sm font-medium text-rust hover:bg-rust/10"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      <AddSessionModal
        open={editing}
        categories={categories}
        editingSession={session}
        onClose={() => setEditing(false)}
        onSaved={load}
      />

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete this session?"
        description={`"${session.title}" will be permanently removed.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  )
}

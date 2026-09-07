import { useEffect, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import type { Category, Session, SessionInput } from '../types'
import { sessionService } from '../services/sessionService'
import { useToast } from '../context/ToastContext'

interface AddSessionModalProps {
  open: boolean
  categories: Category[]
  editingSession?: Session | null
  onClose: () => void
  onSaved: () => void
}

const emptyForm = (categoryId?: number): SessionInput => ({
  title: '',
  categoryId: categoryId ?? 0,
  content: '',
  tags: [],
})

export default function AddSessionModal({ open, categories, editingSession, onClose, onSaved }: AddSessionModalProps) {
  const { showToast } = useToast()
  const [form, setForm] = useState<SessionInput>(emptyForm())
  const [tagsText, setTagsText] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (editingSession) {
      setForm({
        title: editingSession.title,
        categoryId: editingSession.categoryId,
        content: editingSession.content ?? '',
        tags: editingSession.tags,
      })
      setTagsText(editingSession.tags.join(', '))
    } else {
      setForm(emptyForm(categories[0]?.id))
      setTagsText('')
    }
    setErrors({})
  }, [open, editingSession, categories])

  if (!open) return null

  function validate() {
    const next: Record<string, string> = {}
    if (!form.title.trim()) next.title = 'Title is required'
    if (!form.categoryId) next.categoryId = 'Category is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const payload: SessionInput = {
      ...form,
      tags: tagsText.split(',').map((t) => t.trim()).filter(Boolean),
    }

    setSaving(true)
    try {
      if (editingSession) {
        await sessionService.update(editingSession.id, payload)
        showToast('Session updated')
      } else {
        await sessionService.create(payload)
        showToast('Session created')
      }
      onSaved()
      onClose()
    } catch (err) {
      console.error(err)
      showToast('Something went wrong. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-night-500 bg-night-700 px-3 py-2 text-sm text-ink placeholder:text-muted-500 outline-none focus:border-cyan-400/60 focus:shadow-glow'
  const labelClass = 'mb-1 block text-xs font-medium text-muted-400'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-night-950/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl2 border border-night-500 bg-night-800 p-6 shadow-cardHover"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink">
            {editingSession ? 'Edit Session' : 'New Session'}
          </h2>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-muted-400 hover:bg-night-700 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Title *</label>
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Two Pointer Technique"
            />
            {errors.title && <p className="mt-1 text-xs text-rust">{errors.title}</p>}
          </div>

          <div>
            <label className={labelClass}>Category *</label>
            <select
              className={inputClass}
              value={form.categoryId || ''}
              onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
            >
              <option value="" disabled>
                Select…
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="mt-1 text-xs text-rust">{errors.categoryId}</p>}
          </div>

          <div>
            <label className={labelClass}>Content</label>
            <textarea
              className={inputClass}
              rows={6}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write your notes here…"
            />
          </div>

          <div>
            <label className={labelClass}>Tags (comma-separated)</label>
            <input
              className={inputClass}
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="arrays, two-pointer"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium text-muted-300 hover:bg-night-700 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-night-950 hover:bg-cyan-300 disabled:opacity-60"
          >
            {saving ? 'Saving…' : editingSession ? 'Save Changes' : 'Create Session'}
          </button>
        </div>
      </form>
    </div>
  )
}

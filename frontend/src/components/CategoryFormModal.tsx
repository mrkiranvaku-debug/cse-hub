import { useEffect, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import type { Category, CategoryInput } from '../types'
import { categoryService } from '../services/categoryService'
import { notifyCategoriesChanged } from '../hooks/useCategories'
import { useToast } from '../context/ToastContext'

interface CategoryFormModalProps {
  open: boolean
  editingCategory?: Category | null
  onClose: () => void
  onSaved: () => void
}

const emptyForm: CategoryInput = { name: '', icon: '', groupName: '' }

export default function CategoryFormModal({ open, editingCategory, onClose, onSaved }: CategoryFormModalProps) {
  const { showToast } = useToast()
  const [form, setForm] = useState<CategoryInput>(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (editingCategory) {
      setForm({
        name: editingCategory.name,
        icon: editingCategory.icon ?? '',
        groupName: editingCategory.groupName ?? '',
      })
    } else {
      setForm(emptyForm)
    }
    setError(null)
  }, [open, editingCategory])

  if (!open) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const name = form.name.trim()
    if (!name) {
      setError('Category name is required')
      return
    }

    setSaving(true)
    setError(null)
    try {
      const payload: CategoryInput = { ...form, name }
      if (editingCategory) {
        await categoryService.update(editingCategory.id, payload)
        showToast('Category updated')
      } else {
        await categoryService.create(payload)
        showToast('Category created')
      }
      notifyCategoriesChanged()
      onSaved()
      onClose()
    } catch (err: any) {
      const message = err?.response?.data?.message ?? 'Something went wrong. Please try again.'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-night-500 bg-night-700 px-3 py-2 text-sm text-ink placeholder:text-muted-500 outline-none focus:border-cyan-400/60 focus:shadow-glow'
  const labelClass = 'mb-1 block text-xs font-medium text-muted-400'

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-night-950/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl2 border border-night-500 bg-night-800 p-6 shadow-cardHover"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink">
            {editingCategory ? 'Rename Category' : 'Add Category'}
          </h2>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-muted-400 hover:bg-night-700 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Name *</label>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. System Design"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Icon (emoji, optional)</label>
              <input
                className={inputClass}
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="🧠"
                maxLength={4}
              />
            </div>
            <div>
              <label className={labelClass}>Section (optional)</label>
              <input
                className={inputClass}
                value={form.groupName}
                onChange={(e) => setForm({ ...form, groupName: e.target.value })}
                placeholder="LEARNING"
              />
            </div>
          </div>
          <p className="-mt-2 text-xs text-muted-500">
            Categories with the same section name (e.g. "LEARNING") are grouped together in the sidebar.
          </p>

          {error && <p className="text-xs text-rust">{error}</p>}
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
            {saving ? 'Saving…' : editingCategory ? 'Save Changes' : 'Add Category'}
          </button>
        </div>
      </form>
    </div>
  )
}

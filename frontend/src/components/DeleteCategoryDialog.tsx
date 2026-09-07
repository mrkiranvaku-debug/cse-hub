import { useState } from 'react'
import type { Category } from '../types'
import { categoryService } from '../services/categoryService'
import { notifyCategoriesChanged } from '../hooks/useCategories'
import { useToast } from '../context/ToastContext'

interface DeleteCategoryDialogProps {
  category: Category | null
  categories: Category[]
  onClose: () => void
  onDeleted: () => void
}

export default function DeleteCategoryDialog({ category, categories, onClose, onDeleted }: DeleteCategoryDialogProps) {
  const { showToast } = useToast()
  const [reassignTo, setReassignTo] = useState<number | ''>('')
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!category) return null

  const hasItems = category.resourceCount > 0 || category.sessionCount > 0
  const otherCategories = categories.filter((c) => c.id !== category.id)

  async function handleDelete() {
    setDeleting(true)
    setError(null)
    try {
      await categoryService.remove(category!.id, hasItems ? (reassignTo || undefined) : undefined)
      showToast('Category deleted')
      notifyCategoriesChanged()
      onDeleted()
      onClose()
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Could not delete this category.')
    } finally {
      setDeleting(false)
    }
  }

  const canDelete = !hasItems || !!reassignTo

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-night-950/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-xl2 border border-night-500 bg-night-800 p-6 shadow-cardHover">
        <h3 className="text-lg font-semibold text-ink">Delete "{category.name}"?</h3>

        {hasItems ? (
          <>
            <p className="mt-2 text-sm text-muted-400">
              This category still has <span className="text-cyan-300">{category.resourceCount}</span> resource(s) and{' '}
              <span className="text-cyan-300">{category.sessionCount}</span> session(s). Choose another category to move
              them into before deleting — nothing will be lost.
            </p>

            {otherCategories.length === 0 ? (
              <p className="mt-3 text-xs text-rust">
                Create another category first so these items have somewhere to go.
              </p>
            ) : (
              <select
                value={reassignTo}
                onChange={(e) => setReassignTo(e.target.value ? Number(e.target.value) : '')}
                className="mt-4 w-full rounded-lg border border-night-500 bg-night-700 px-3 py-2 text-sm text-ink outline-none focus:border-cyan-400/60"
              >
                <option value="">Move items to…</option>
                {otherCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            )}
          </>
        ) : (
          <p className="mt-2 text-sm text-muted-400">This category is empty and can be safely deleted.</p>
        )}

        {error && <p className="mt-3 text-xs text-rust">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-full px-4 py-2 text-sm font-medium text-muted-300 hover:bg-night-700 hover:text-white">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!canDelete || deleting}
            className="rounded-full bg-rust px-4 py-2 text-sm font-medium text-night-950 hover:bg-rust/90 disabled:opacity-50"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

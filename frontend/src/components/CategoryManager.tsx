import { useState } from 'react'
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from 'lucide-react'
import type { Category } from '../types'
import { categoryService } from '../services/categoryService'
import { notifyCategoriesChanged } from '../hooks/useCategories'
import { useToast } from '../context/ToastContext'
import CategoryFormModal from './CategoryFormModal'
import DeleteCategoryDialog from './DeleteCategoryDialog'
import Loading from './Loading'
import EmptyState from './EmptyState'

interface CategoryManagerProps {
  categories: Category[]
  loading: boolean
  onChanged: () => void
}

export default function CategoryManager({ categories, loading, onChanged }: CategoryManagerProps) {
  const { showToast } = useToast()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)
  const [reordering, setReordering] = useState(false)

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= categories.length || reordering) return

    const reordered = [...categories]
    ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]

    setReordering(true)
    try {
      await categoryService.reorder(reordered.map((c) => c.id))
      notifyCategoriesChanged()
      onChanged()
    } catch (err) {
      console.error(err)
      showToast('Could not reorder categories', 'error')
    } finally {
      setReordering(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-400">
          Categories power the sidebar, category pages, and the dropdown shown when adding resources or sessions.
        </p>
        <button
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-night-950 hover:bg-cyan-300"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : categories.length === 0 ? (
        <EmptyState icon="🗂️" title="No categories yet" description="Add your first category to start organizing resources." />
      ) : (
        <div className="flex flex-col gap-2">
          {categories.map((c, index) => (
            <div
              key={c.id}
              className="flex items-center gap-3 rounded-xl2 border border-night-500 bg-night-800 px-4 py-3 shadow-card"
            >
              <div className="flex flex-col">
                <button
                  onClick={() => move(index, -1)}
                  disabled={index === 0 || reordering}
                  className="rounded p-0.5 text-muted-500 hover:text-cyan-300 disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={index === categories.length - 1 || reordering}
                  className="rounded p-0.5 text-muted-500 hover:text-cyan-300 disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ChevronDown size={14} />
                </button>
              </div>

              <span className="text-lg">{c.icon || '📁'}</span>

              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-ink">{c.name}</p>
                <p className="truncate text-xs text-muted-500">
                  {c.groupName ? `${c.groupName} · ` : ''}
                  {c.resourceCount} resource{c.resourceCount === 1 ? '' : 's'} · {c.sessionCount} session
                  {c.sessionCount === 1 ? '' : 's'}
                </p>
              </div>

              <button
                onClick={() => {
                  setEditing(c)
                  setFormOpen(true)
                }}
                className="rounded-full p-2 text-muted-400 hover:bg-night-700 hover:text-cyan-300"
                aria-label="Rename category"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => setDeleting(c)}
                className="rounded-full p-2 text-muted-400 hover:bg-night-700 hover:text-rust"
                aria-label="Delete category"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      <CategoryFormModal open={formOpen} editingCategory={editing} onClose={() => setFormOpen(false)} onSaved={onChanged} />
      <DeleteCategoryDialog
        category={deleting}
        categories={categories}
        onClose={() => setDeleting(null)}
        onDeleted={onChanged}
      />
    </div>
  )
}

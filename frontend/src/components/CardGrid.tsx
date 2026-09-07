import { useState } from 'react'
import type { Category, Resource } from '../types'
import ResourceCard from './ResourceCard'
import ResourceDetailModal from './ResourceDetailModal'
import AddResourceModal from './AddResourceModal'
import ConfirmDialog from './ConfirmDialog'
import EmptyState from './EmptyState'
import { resourceService } from '../services/resourceService'
import { useToast } from '../context/ToastContext'

interface CardGridProps {
  resources: Resource[]
  categories: Category[]
  onChanged: () => void
  emptyTitle?: string
  emptyDescription?: string
}

export default function CardGrid({
  resources,
  categories,
  onChanged,
  emptyTitle = 'Nothing here yet',
  emptyDescription = 'Resources you save will show up here.',
}: CardGridProps) {
  const { showToast } = useToast()
  const [selected, setSelected] = useState<Resource | null>(null)
  const [editing, setEditing] = useState<Resource | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Resource | null>(null)

  async function handleDelete() {
    if (!pendingDelete) return
    try {
      await resourceService.remove(pendingDelete.id)
      showToast('Resource deleted')
      setPendingDelete(null)
      setSelected(null)
      onChanged()
    } catch (err) {
      console.error(err)
      showToast('Could not delete resource', 'error')
    }
  }

  if (resources.length === 0) {
    return <EmptyState icon="📚" title={emptyTitle} description={emptyDescription} />
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {resources.map((r) => (
          <ResourceCard key={r.id} resource={r} onClick={() => setSelected(r)} />
        ))}
      </div>

      {selected && (
        <ResourceDetailModal
          resource={selected}
          onClose={() => setSelected(null)}
          onEdit={() => {
            setEditing(selected)
            setSelected(null)
          }}
          onDelete={() => setPendingDelete(selected)}
        />
      )}

      <AddResourceModal
        open={!!editing}
        categories={categories}
        editingResource={editing}
        onClose={() => setEditing(null)}
        onSaved={onChanged}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this resource?"
        description={pendingDelete ? `"${pendingDelete.title}" will be permanently removed.` : undefined}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}

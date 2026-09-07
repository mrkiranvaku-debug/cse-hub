import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import CardGrid from '../components/CardGrid'
import Loading from '../components/Loading'
import { useCategories } from '../hooks/useCategories'
import { useResources } from '../hooks/useResources'
import { RESOURCE_STATUS_LABELS, RESOURCE_TYPE_LABELS, type ResourceStatus, type ResourceType } from '../types'

export default function AllResourcesPage() {
  const { categories } = useCategories()
  const [type, setType] = useState<ResourceType | ''>('')
  const [status, setStatus] = useState<ResourceStatus | ''>('')

  const { resources, loading, error, refresh } = useResources({
    type: type || undefined,
    status: status || undefined,
  })

  return (
    <div className="flex flex-col gap-6">
      <Link to="/" className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-400 hover:text-white">
        <ArrowLeft size={16} /> Back
      </Link>

      <div>
        <h1 className="text-2xl font-semibold text-ink">All Resources</h1>
        <p className="mt-1 text-sm text-muted-400">Everything you've saved, across every category.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ResourceType | '')}
          className="rounded-full border border-night-500 bg-night-800 px-3 py-1.5 text-sm text-ink outline-none focus:border-cyan-400/60"
        >
          <option value="">All types</option>
          {Object.entries(RESOURCE_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ResourceStatus | '')}
          className="rounded-full border border-night-500 bg-night-800 px-3 py-1.5 text-sm text-ink outline-none focus:border-cyan-400/60"
        >
          <option value="">All statuses</option>
          {Object.entries(RESOURCE_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-sm text-rust">{error}</p>
      ) : (
        <CardGrid
          resources={resources}
          categories={categories}
          onChanged={refresh}
          emptyTitle="No resources yet"
          emptyDescription="Click “Add Resource” to save your first link, note or course."
        />
      )}
    </div>
  )
}

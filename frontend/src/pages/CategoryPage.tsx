import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import CardGrid from '../components/CardGrid'
import Loading from '../components/Loading'
import { useCategories } from '../hooks/useCategories'
import { useResources } from '../hooks/useResources'
import { RESOURCE_STATUS_LABELS, RESOURCE_TYPE_LABELS, type ResourceStatus, type ResourceType } from '../types'

export default function CategoryPage() {
  const { id } = useParams()
  const categoryId = Number(id)
  const { categories } = useCategories()
  const [type, setType] = useState<ResourceType | ''>('')
  const [status, setStatus] = useState<ResourceStatus | ''>('')

  const { resources, loading, error, refresh } = useResources({
    categoryId,
    type: type || undefined,
    status: status || undefined,
  })

  const category = categories.find((c) => c.id === categoryId)

  return (
    <div className="flex flex-col gap-6">
      <Link to="/" className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-400 hover:text-white">
        <ArrowLeft size={16} /> Back
      </Link>

      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-ink">
          <span>{category?.icon}</span> {category?.name ?? 'Category'}
        </h1>
        {category?.description && <p className="mt-1 text-sm text-muted-400">{category.description}</p>}
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
          emptyTitle="No resources in this category yet"
          emptyDescription="Add a resource and select this category to see it here."
        />
      )}
    </div>
  )
}

import { Link, useSearchParams } from 'react-router-dom'
import CardGrid from '../components/CardGrid'
import Loading from '../components/Loading'
import EmptyState from '../components/EmptyState'
import { useCategories } from '../hooks/useCategories'
import { useResources } from '../hooks/useResources'
import { useSessions } from '../hooks/useSessions'

export default function SearchResultsPage() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const { categories } = useCategories()
  const { resources, loading: loadingResources, refresh } = useResources({ q })
  const { sessions, loading: loadingSessions } = useSessions({ q })

  const loading = loadingResources || loadingSessions
  const hasResults = resources.length > 0 || sessions.length > 0

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Search results</h1>
        <p className="mt-1 text-sm text-muted-400">
          Showing matches for <span className="font-medium text-cyan-300">“{q}”</span>
        </p>
      </div>

      {loading ? (
        <Loading />
      ) : !hasResults ? (
        <EmptyState icon="🔍" title="No matches found" description="Try a different search term." />
      ) : (
        <>
          {resources.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-ink">Resources</h2>
              <CardGrid resources={resources} categories={categories} onChanged={refresh} />
            </section>
          )}

          {sessions.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-ink">Sessions</h2>
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
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

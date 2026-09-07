import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Banner from '../components/Banner'
import CardGrid from '../components/CardGrid'
import Loading from '../components/Loading'
import { useCategories } from '../hooks/useCategories'
import { useResources } from '../hooks/useResources'
import { useSiteSettings } from '../hooks/useSiteSettings'

export default function Home() {
  const { categories } = useCategories()
  const { resources, loading, error, refresh } = useResources()
  const { settings } = useSiteSettings()

  const recent = resources.slice(0, 12)

  return (
    <div className="flex flex-col gap-6">
      <Banner title={settings?.bannerTitle} tagline={settings?.bannerTagline} imageUrl={settings?.bannerImageUrl} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">{settings?.greeting ?? 'Welcome'}</h1>
          <p className="mt-1 text-sm text-muted-400">
            {settings?.subtitle ?? 'Your personal Computer Science knowledge space.'}
          </p>
          {settings?.supportingText && <p className="mt-1 text-xs text-muted-500">{settings.supportingText}</p>}
        </div>

        {settings?.quoteText && (
          <div className="w-full max-w-xs rounded-xl2 border-l-2 border-cyan-400 bg-night-800 px-4 py-3 shadow-card sm:w-auto">
            <p className="text-sm italic leading-snug text-muted-200">“{settings.quoteText}”</p>
            {settings.quoteAuthor && <p className="mt-1.5 text-right text-xs text-cyan-400">— {settings.quoteAuthor}</p>}
          </div>
        )}
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">🔥 Recently Saved</h2>
          {recent.length > 0 && (
            <Link to="/resources" className="flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300">
              View All <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {loading ? (
          <Loading />
        ) : error ? (
          <p className="text-sm text-rust">{error}</p>
        ) : (
          <CardGrid
            resources={recent}
            categories={categories}
            onChanged={refresh}
            emptyTitle="No resources yet"
            emptyDescription="Click “Add Resource” to save your first link, note or course."
          />
        )}
      </section>
    </div>
  )
}

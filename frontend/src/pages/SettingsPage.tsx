import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Image as ImageIcon, MessageSquare, Sliders, Trash2, Upload } from 'lucide-react'
import Loading from '../components/Loading'
import CategoryManager from '../components/CategoryManager'
import { useCategories } from '../hooks/useCategories'
import { useSiteSettings, notifySettingsChanged } from '../hooks/useSiteSettings'
import { settingsService } from '../services/settingsService'
import { useToast } from '../context/ToastContext'
import { resolveFileUrl } from '../lib/apiOrigin'
import type { SiteSettings } from '../types'

type Tab = 'general' | 'banner' | 'categories' | 'sessions'

const TABS: { id: Tab; label: string; icon: typeof Sliders }[] = [
  { id: 'general', label: 'General', icon: MessageSquare },
  { id: 'banner', label: 'Banner', icon: ImageIcon },
  { id: 'categories', label: 'Categories', icon: Sliders },
  { id: 'sessions', label: 'Sessions', icon: MessageSquare },
]

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('general')
  const { categories, loading: categoriesLoading, refresh: refreshCategories } = useCategories()
  const { settings, loading: settingsLoading, refresh: refreshSettings } = useSiteSettings()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Customize CSE Hub</h1>
        <p className="mt-1 text-sm text-muted-400">
          Manage everything from here — no code changes needed.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-night-500 pb-px">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
              tab === id
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-muted-400 hover:text-white'
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {tab === 'general' && (
        <GeneralSection settings={settings} loading={settingsLoading} onSaved={refreshSettings} />
      )}
      {tab === 'banner' && (
        <BannerSection settings={settings} loading={settingsLoading} onSaved={refreshSettings} />
      )}
      {tab === 'categories' && (
        <CategoryManager categories={categories} loading={categoriesLoading} onChanged={refreshCategories} />
      )}
      {tab === 'sessions' && <SessionsSection />}
    </div>
  )
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-400">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted-500">{hint}</p>}
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-night-500 bg-night-700 px-3 py-2 text-sm text-ink placeholder:text-muted-500 outline-none focus:border-cyan-400/60 focus:shadow-glow'

function GeneralSection({
  settings,
  loading,
  onSaved,
}: {
  settings: SiteSettings | null
  loading: boolean
  onSaved: () => void
}) {
  const { showToast } = useToast()
  const [form, setForm] = useState<SiteSettings | null>(settings)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (settings) setForm(settings)
  }, [settings])

  if (loading || !form) return <Loading />

  async function handleSave() {
    if (!form) return
    setSaving(true)
    try {
      await settingsService.update({
        greeting: form.greeting,
        subtitle: form.subtitle,
        quoteText: form.quoteText,
        quoteAuthor: form.quoteAuthor,
        supportingText: form.supportingText,
      })
      notifySettingsChanged()
      onSaved()
      showToast('Home page text updated')
    } catch (err) {
      console.error(err)
      showToast('Could not save changes', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex max-w-lg flex-col gap-4 rounded-xl2 border border-night-500 bg-night-800 p-6 shadow-card">
      <Field label="Greeting" hint='Shown at the top of the home page, e.g. "Good afternoon, Kiran 👋"'>
        <input className={inputClass} value={form.greeting} onChange={(e) => setForm({ ...form, greeting: e.target.value })} />
      </Field>
      <Field label="Subtitle">
        <input className={inputClass} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
      </Field>
      <Field label="Motivational quote">
        <textarea
          className={inputClass}
          rows={2}
          value={form.quoteText}
          onChange={(e) => setForm({ ...form, quoteText: e.target.value })}
        />
      </Field>
      <Field label="Quote author / source">
        <input className={inputClass} value={form.quoteAuthor} onChange={(e) => setForm({ ...form, quoteAuthor: e.target.value })} />
      </Field>
      <Field label="Supporting text (optional)">
        <input
          className={inputClass}
          value={form.supportingText ?? ''}
          onChange={(e) => setForm({ ...form, supportingText: e.target.value })}
          placeholder="Any extra line shown near the greeting"
        />
      </Field>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-2 w-fit rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-night-950 hover:bg-cyan-300 disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  )
}

function BannerSection({
  settings,
  loading,
  onSaved,
}: {
  settings: SiteSettings | null
  loading: boolean
  onSaved: () => void
}) {
  const { showToast } = useToast()
  const [form, setForm] = useState<SiteSettings | null>(settings)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (settings) setForm(settings)
  }, [settings])

  if (loading || !form) return <Loading />

  async function handleSaveText() {
    if (!form) return
    setSaving(true)
    try {
      await settingsService.update({ bannerTitle: form.bannerTitle, bannerTagline: form.bannerTagline })
      notifySettingsChanged()
      onSaved()
      showToast('Banner text updated')
    } catch (err) {
      console.error(err)
      showToast('Could not save changes', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await settingsService.uploadBanner(file)
      notifySettingsChanged()
      onSaved()
      showToast('Banner image updated')
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? 'Could not upload that image', 'error')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleRemove() {
    setUploading(true)
    try {
      await settingsService.removeBanner()
      notifySettingsChanged()
      onSaved()
      showToast('Banner reset to default')
    } catch (err) {
      console.error(err)
      showToast('Could not reset banner', 'error')
    } finally {
      setUploading(false)
    }
  }

  const bannerPreview = resolveFileUrl(form.bannerImageUrl)

  return (
    <div className="flex max-w-lg flex-col gap-5 rounded-xl2 border border-night-500 bg-night-800 p-6 shadow-card">
      <div>
        <p className="mb-2 text-xs font-medium text-muted-400">Banner image</p>
        <div className="mb-3 flex h-32 items-center justify-center overflow-hidden rounded-lg border border-night-500 bg-night-700">
          {bannerPreview ? (
            <img src={bannerPreview} alt="Banner preview" className="h-full w-full object-cover" />
          ) : (
            <p className="text-xs text-muted-500">Using the default futuristic hero — no custom image uploaded</p>
          )}
        </div>
        <div className="flex gap-3">
          <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-night-500 px-4 py-2 text-sm font-medium text-ink hover:bg-night-700">
            <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload Image'}
            <input ref={fileInputRef} type="file" accept=".png,.jpg,.jpeg,.webp" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
          {bannerPreview && (
            <button
              onClick={handleRemove}
              disabled={uploading}
              className="flex items-center gap-1.5 rounded-full border border-rust/30 px-4 py-2 text-sm font-medium text-rust hover:bg-rust/10"
            >
              <Trash2 size={14} /> Reset to default
            </button>
          )}
        </div>
      </div>

      <Field label="Banner title">
        <input className={inputClass} value={form.bannerTitle} onChange={(e) => setForm({ ...form, bannerTitle: e.target.value })} />
      </Field>
      <Field label="Banner tagline">
        <input className={inputClass} value={form.bannerTagline} onChange={(e) => setForm({ ...form, bannerTagline: e.target.value })} />
      </Field>

      <button
        onClick={handleSaveText}
        disabled={saving}
        className="w-fit rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-night-950 hover:bg-cyan-300 disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  )
}

function SessionsSection() {
  return (
    <div className="max-w-lg rounded-xl2 border border-night-500 bg-night-800 p-6 shadow-card">
      <p className="text-sm text-muted-300">
        Sessions have their own dedicated page for creating, editing, searching, and deleting notes — with full
        category and tag support.
      </p>
      <Link
        to="/sessions"
        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-night-950 hover:bg-cyan-300"
      >
        Go to Sessions
      </Link>
    </div>
  )
}

import { useState } from 'react'
import {
  Award,
  Bookmark,
  BookOpen,
  Code2,
  FileText,
  Github,
  GraduationCap,
  Play,
  Rocket,
  Trophy,
  type LucideIcon,
} from 'lucide-react'
import { RESOURCE_STATUS_LABELS, RESOURCE_TYPE_LABELS, type Resource, type ResourceType } from '../types'
import { resolveFileUrl, formatFileSize } from '../lib/apiOrigin'

const TYPE_ICON: Record<ResourceType, { icon: LucideIcon; classes: string }> = {
  ARTICLE: { icon: FileText, classes: 'bg-blue-500/15 text-blue-300' },
  VIDEO: { icon: Play, classes: 'bg-rose-500/15 text-rose-300' },
  COURSE: { icon: GraduationCap, classes: 'bg-emerald-500/15 text-emerald-300' },
  GITHUB: { icon: Github, classes: 'bg-slate-400/15 text-slate-200' },
  INTERNSHIP: { icon: Rocket, classes: 'bg-orange-500/15 text-orange-300' },
  HACKATHON: { icon: Trophy, classes: 'bg-amber-500/15 text-amber-300' },
  CERTIFICATION: { icon: Award, classes: 'bg-purple-500/15 text-purple-300' },
  PROJECT: { icon: Code2, classes: 'bg-cyan-500/15 text-cyan-300' },
  DOCUMENTATION: { icon: BookOpen, classes: 'bg-violet-500/15 text-violet-300' },
  OTHER: { icon: FileText, classes: 'bg-slate-500/15 text-slate-300' },
}

const STATUS_STYLES: Record<string, string> = {
  TO_LEARN: 'bg-night-600 text-muted-300',
  LEARNING: 'bg-cyan-500/15 text-cyan-300',
  COMPLETED: 'bg-emerald-500/15 text-emerald-300',
  REFERENCE: 'bg-amber-500/15 text-amber-300',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ResourceCard({
  resource,
  onClick,
}: {
  resource: Resource
  onClick: () => void
}) {
  const [saved, setSaved] = useState(false)
  const { icon: TypeIcon, classes: typeClasses } = TYPE_ICON[resource.resourceType] ?? TYPE_ICON.OTHER
  const thumbnail = resolveFileUrl(resource.thumbnailUrl)

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="group relative flex cursor-pointer flex-col gap-3 rounded-xl2 border border-night-500 bg-night-800 p-4 text-left shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-cardHover"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg ${thumbnail ? 'bg-night-700' : typeClasses}`}>
            {thumbnail ? <img src={thumbnail} alt="" className="h-full w-full object-cover" /> : <TypeIcon size={18} />}
          </div>
          <span className="rounded-full border border-night-500 bg-night-700 px-2.5 py-1 text-[11px] font-medium text-muted-300">
            {RESOURCE_TYPE_LABELS[resource.resourceType]}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            setSaved((s) => !s)
          }}
          aria-label="Bookmark"
          className={`rounded-md p-1 transition-colors ${saved ? 'text-cyan-400' : 'text-muted-500 hover:text-cyan-300'}`}
        >
          <Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div>
        <h3 className="font-semibold leading-snug text-ink line-clamp-2">{resource.title}</h3>
        {resource.description && (
          <p className="mt-1 text-sm text-muted-400 line-clamp-2">{resource.description}</p>
        )}
      </div>

      {resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {resource.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full border border-night-500 bg-night-700 px-2 py-0.5 text-[11px] text-cyan-300/90"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between pt-1 text-[11px] text-muted-500">
        <div className="flex items-center gap-1.5">
          <span>{resource.categoryIcon}</span>
          <span>{resource.categoryName}</span>
        </div>
        <span className={`rounded-full px-2 py-0.5 font-medium ${STATUS_STYLES[resource.status]}`}>
          {RESOURCE_STATUS_LABELS[resource.status]}
        </span>
      </div>
      <p className="text-[11px] text-muted-600">
        Added {formatDate(resource.createdAt)}
        {resource.sourceType === 'FILE' && resource.fileSize ? ` · ${formatFileSize(resource.fileSize)}` : ''}
      </p>
    </div>
  )
}

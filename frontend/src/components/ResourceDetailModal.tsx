import { Download, ExternalLink, Pencil, Trash2, X } from 'lucide-react'
import { RESOURCE_STATUS_LABELS, RESOURCE_TYPE_LABELS, type Resource } from '../types'
import { resolveFileUrl, formatFileSize } from '../lib/apiOrigin'

interface ResourceDetailModalProps {
  resource: Resource
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function ResourceDetailModal({ resource, onClose, onEdit, onDelete }: ResourceDetailModalProps) {
  const thumbnail = resolveFileUrl(resource.thumbnailUrl)
  const fileUrl = resolveFileUrl(resource.url)
  const isFile = resource.sourceType === 'FILE'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-night-950/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl2 border border-night-500 bg-night-800 shadow-cardHover"
      >
        <div className="relative flex h-32 w-full items-center justify-center overflow-hidden border-b border-night-500 bg-night-700">
          {thumbnail ? (
            <img src={thumbnail} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="text-5xl opacity-70">{resource.categoryIcon ?? '📄'}</div>
          )}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-night-900/80 p-1.5 text-muted-300 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 text-xs font-medium text-cyan-300">
            <span>{resource.categoryIcon}</span>
            <span>{resource.categoryName}</span>
            <span className="text-muted-600">•</span>
            <span>{RESOURCE_TYPE_LABELS[resource.resourceType]}</span>
          </div>

          <h2 className="mt-2 text-2xl font-semibold text-ink">{resource.title}</h2>

          {resource.description && (
            <p className="mt-3 text-sm leading-relaxed text-muted-300">{resource.description}</p>
          )}

          {isFile && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-night-500 bg-night-700 px-3 py-2 text-sm text-ink">
              <span>📎</span>
              <span className="flex-1 truncate">{resource.originalFileName ?? 'Uploaded file'}</span>
              <span className="text-xs text-muted-500">{formatFileSize(resource.fileSize)}</span>
            </div>
          )}

          {resource.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {resource.tags.map((t) => (
                <span key={t} className="rounded-full border border-night-500 bg-night-700 px-2.5 py-1 text-xs text-cyan-300/90">
                  #{t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between border-t border-night-500 pt-4 text-xs text-muted-500">
            <span className="rounded-full bg-cyan-500/15 px-2.5 py-1 font-medium text-cyan-300">
              {RESOURCE_STATUS_LABELS[resource.status]}
            </span>
            <span>Added {new Date(resource.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {fileUrl && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-night-950 hover:bg-cyan-300"
              >
                Open {isFile ? '' : 'link'} <ExternalLink size={14} />
              </a>
            )}
            {isFile && fileUrl && (
              <a
                href={fileUrl}
                download={resource.originalFileName ?? undefined}
                className="flex items-center gap-1.5 rounded-full border border-night-500 px-4 py-2 text-sm font-medium text-ink hover:bg-night-700"
              >
                Download <Download size={14} />
              </a>
            )}
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 rounded-full border border-night-500 px-4 py-2 text-sm font-medium text-ink hover:bg-night-700"
            >
              <Pencil size={14} /> Edit
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 rounded-full border border-rust/30 px-4 py-2 text-sm font-medium text-rust hover:bg-rust/10"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

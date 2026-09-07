import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Image as ImageIcon, Trash2, Upload, X } from 'lucide-react'
import type { Category, Resource, ResourceInput, ResourceStatus, ResourceType } from '../types'
import { RESOURCE_STATUS_LABELS, RESOURCE_TYPE_LABELS } from '../types'
import { resourceService } from '../services/resourceService'
import { useToast } from '../context/ToastContext'
import { resolveFileUrl, formatFileSize } from '../lib/apiOrigin'

interface AddResourceModalProps {
  open: boolean
  categories: Category[]
  editingResource?: Resource | null
  defaultCategoryId?: number
  onClose: () => void
  onSaved: () => void
}

type Source = 'LINK' | 'FILE'

const RESOURCE_TYPES = Object.keys(RESOURCE_TYPE_LABELS) as ResourceType[]
const RESOURCE_STATUSES = Object.keys(RESOURCE_STATUS_LABELS) as ResourceStatus[]
const ACCEPTED_FILE_TYPES = '.pdf,.ppt,.pptx,.png,.jpg,.jpeg,.webp'

const emptyForm = (defaultCategoryId?: number): ResourceInput => ({
  title: '',
  description: '',
  url: '',
  thumbnailUrl: '',
  categoryId: defaultCategoryId ?? 0,
  resourceType: 'ARTICLE',
  status: 'TO_LEARN',
  tags: [],
})

function fileIconFor(name: string) {
  const ext = name.split('.').pop()?.toLowerCase()
  if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'webp') return '🖼'
  if (ext === 'ppt' || ext === 'pptx') return '📊'
  return '📄'
}

export default function AddResourceModal({
  open,
  categories,
  editingResource,
  defaultCategoryId,
  onClose,
  onSaved,
}: AddResourceModalProps) {
  const { showToast } = useToast()
  const [form, setForm] = useState<ResourceInput>(emptyForm(defaultCategoryId))
  const [tagsText, setTagsText] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  // Source-of-truth for NEW resources only. When editing, the resource's
  // existing sourceType decides which fields show — you can't switch an
  // existing resource between link and upload, only replace its file.
  const [source, setSource] = useState<Source>('LINK')
  const [newFile, setNewFile] = useState<File | null>(null)
  const [replacementFile, setReplacementFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)

  const isEditingFileResource = editingResource?.sourceType === 'FILE'

  useEffect(() => {
    if (!open) return
    if (editingResource) {
      setForm({
        title: editingResource.title,
        description: editingResource.description ?? '',
        url: editingResource.url ?? '',
        thumbnailUrl: editingResource.thumbnailUrl ?? '',
        categoryId: editingResource.categoryId,
        resourceType: editingResource.resourceType,
        status: editingResource.status,
        tags: editingResource.tags,
      })
      setTagsText(editingResource.tags.join(', '))
      setSource(editingResource.sourceType)
    } else {
      setForm(emptyForm(defaultCategoryId ?? categories[0]?.id))
      setTagsText('')
      setSource('LINK')
    }
    setNewFile(null)
    setReplacementFile(null)
    setThumbnailFile(null)
    setErrors({})
  }, [open, editingResource, defaultCategoryId, categories])

  if (!open) return null

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!form.title.trim()) next.title = 'Title is required'
    if (!form.categoryId) next.categoryId = 'Category is required'
    if (!form.resourceType) next.resourceType = 'Resource type is required'
    if (!editingResource && source === 'LINK' && !form.url?.trim()) next.url = 'URL is required'
    if (!editingResource && source === 'FILE' && !newFile) next.file = 'Choose a file to upload'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const tags = tagsText.split(',').map((t) => t.trim()).filter(Boolean)
    setSaving(true)
    try {
      let savedId: number

      if (editingResource) {
        const updated = await resourceService.update(editingResource.id, { ...form, tags })
        savedId = updated.id
        if (isEditingFileResource && replacementFile) {
          await resourceService.replaceFile(editingResource.id, replacementFile)
        }
        showToast('Resource updated')
      } else if (source === 'FILE' && newFile) {
        const created = await resourceService.uploadNew({
          title: form.title,
          description: form.description,
          categoryId: form.categoryId,
          resourceType: form.resourceType,
          status: form.status,
          tags,
          file: newFile,
        })
        savedId = created.id
        showToast('Resource added')
      } else {
        const created = await resourceService.create({ ...form, tags })
        savedId = created.id
        showToast('Resource added')
      }

      if (thumbnailFile) {
        await resourceService.uploadThumbnail(savedId, thumbnailFile)
      }

      onSaved()
      onClose()
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? 'Something went wrong. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleRemoveThumbnail() {
    if (!editingResource?.thumbnailUrl) {
      setForm({ ...form, thumbnailUrl: '' })
      setThumbnailFile(null)
      return
    }
    try {
      await resourceService.removeThumbnail(editingResource.id)
      setForm({ ...form, thumbnailUrl: '' })
      setThumbnailFile(null)
      onSaved()
      showToast('Thumbnail removed')
    } catch (err) {
      console.error(err)
      showToast('Could not remove thumbnail', 'error')
    }
  }

  const inputClass =
    'w-full rounded-lg border border-night-500 bg-night-700 px-3 py-2 text-sm text-ink placeholder:text-muted-500 outline-none focus:border-cyan-400/60 focus:shadow-glow'
  const labelClass = 'mb-1 block text-xs font-medium text-muted-400'
  const currentThumbnail = resolveFileUrl(form.thumbnailUrl)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-night-950/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl2 border border-night-500 bg-night-800 p-6 shadow-cardHover"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink">
            {editingResource ? 'Edit Resource' : 'Add Resource'}
          </h2>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-muted-400 hover:bg-night-700 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {!editingResource && (
            <div>
              <label className={labelClass}>Resource Source</label>
              <div className="flex gap-4 rounded-lg border border-night-500 bg-night-700 p-3">
                <label className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="radio"
                    checked={source === 'LINK'}
                    onChange={() => setSource('LINK')}
                    className="accent-cyan-400"
                  />
                  External Link
                </label>
                <label className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="radio"
                    checked={source === 'FILE'}
                    onChange={() => setSource('FILE')}
                    className="accent-cyan-400"
                  />
                  Upload File
                </label>
              </div>
            </div>
          )}

          <div>
            <label className={labelClass}>Title *</label>
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Sliding Window Patterns"
            />
            {errors.title && <p className="mt-1 text-xs text-rust">{errors.title}</p>}
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              className={inputClass}
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short summary of this resource"
            />
          </div>

          {/* LINK: URL field (new link resource, or editing an existing link resource) */}
          {(!editingResource ? source === 'LINK' : editingResource.sourceType === 'LINK') && (
            <div>
              <label className={labelClass}>URL {!editingResource && '*'}</label>
              <input
                className={inputClass}
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://…"
              />
              {errors.url && <p className="mt-1 text-xs text-rust">{errors.url}</p>}
            </div>
          )}

          {/* FILE: new upload (creating a new file resource) */}
          {!editingResource && source === 'FILE' && (
            <div>
              <label className={labelClass}>File *</label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-night-500 bg-night-700 px-4 py-6 text-sm text-muted-400 hover:border-cyan-400/50">
                <Upload size={16} />
                {newFile ? 'Choose a different file' : 'Choose File'}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_FILE_TYPES}
                  className="hidden"
                  onChange={(e) => setNewFile(e.target.files?.[0] ?? null)}
                />
              </label>
              {newFile && (
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-night-500 bg-night-700 px-3 py-2 text-sm text-ink">
                  <span>{fileIconFor(newFile.name)}</span>
                  <span className="flex-1 truncate">{newFile.name}</span>
                  <span className="text-xs text-muted-500">{formatFileSize(newFile.size)}</span>
                </div>
              )}
              {errors.file && <p className="mt-1 text-xs text-rust">{errors.file}</p>}
              <p className="mt-1 text-xs text-muted-500">Supports PDF, PPT, PPTX, PNG, JPG, JPEG, WEBP — up to 25MB.</p>
            </div>
          )}

          {/* FILE: existing file resource being edited — show current file + optional replace */}
          {isEditingFileResource && (
            <div>
              <label className={labelClass}>Uploaded File</label>
              <div className="flex items-center gap-2 rounded-lg border border-night-500 bg-night-700 px-3 py-2 text-sm text-ink">
                <span>{fileIconFor(editingResource!.originalFileName ?? '')}</span>
                <span className="flex-1 truncate">{editingResource!.originalFileName ?? 'Uploaded file'}</span>
                <span className="text-xs text-muted-500">{formatFileSize(editingResource!.fileSize)}</span>
              </div>
              <label className="mt-2 flex cursor-pointer items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300">
                <Upload size={13} /> {replacementFile ? `Replacing with: ${replacementFile.name}` : 'Replace file'}
                <input
                  type="file"
                  accept={ACCEPTED_FILE_TYPES}
                  className="hidden"
                  onChange={(e) => setReplacementFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Category *</label>
              <select
                className={inputClass}
                value={form.categoryId || ''}
                onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
              >
                <option value="" disabled>
                  Select…
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 text-xs text-rust">{errors.categoryId}</p>}
            </div>

            <div>
              <label className={labelClass}>Resource Type *</label>
              <select
                className={inputClass}
                value={form.resourceType}
                onChange={(e) => setForm({ ...form, resourceType: e.target.value as ResourceType })}
              >
                {RESOURCE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {RESOURCE_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as ResourceStatus })}
            >
              {RESOURCE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {RESOURCE_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Thumbnail / Cover Image</label>
            {currentThumbnail && (
              <div className="mb-2 flex items-center gap-3">
                <img src={currentThumbnail} alt="" className="h-14 w-14 rounded-lg border border-night-500 object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveThumbnail}
                  className="flex items-center gap-1 text-xs font-medium text-rust hover:text-rust/80"
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            )}
            <input
              className={inputClass}
              value={form.thumbnailUrl}
              onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
              placeholder="Thumbnail URL (https://…) — or upload one below"
            />
            <label className="mt-2 flex cursor-pointer items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300">
              <ImageIcon size={13} /> {thumbnailFile ? `Selected: ${thumbnailFile.name}` : 'Upload an image instead'}
              <input
                ref={thumbnailInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                className="hidden"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
              />
            </label>
            {thumbnailFile && <p className="mt-1 text-xs text-muted-500">Uploading this image will replace the thumbnail URL above.</p>}
          </div>

          <div>
            <label className={labelClass}>Tags (comma-separated)</label>
            <input
              className={inputClass}
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="arrays, sliding-window"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium text-muted-300 hover:bg-night-700 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-night-950 hover:bg-cyan-300 disabled:opacity-60"
          >
            {saving ? 'Saving…' : editingResource ? 'Save Changes' : 'Add Resource'}
          </button>
        </div>
      </form>
    </div>
  )
}

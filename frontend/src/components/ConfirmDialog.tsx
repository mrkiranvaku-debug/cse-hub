interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-night-950/70 p-4 backdrop-blur-sm" onClick={onCancel}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-xl2 border border-night-500 bg-night-800 p-6 shadow-cardHover"
      >
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        {description && <p className="mt-2 text-sm text-muted-400">{description}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-full px-4 py-2 text-sm font-medium text-muted-300 hover:bg-night-700 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full bg-rust px-4 py-2 text-sm font-medium text-night-950 hover:bg-rust/90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

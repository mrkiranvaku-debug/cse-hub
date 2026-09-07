import type { ReactNode } from 'react'

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-dashed border-night-500 bg-night-800/50 px-8 py-16 text-center">
      {icon && <div className="text-4xl">{icon}</div>}
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted-400">{description}</p>}
      {action}
    </div>
  )
}

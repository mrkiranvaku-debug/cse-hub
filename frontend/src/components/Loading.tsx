export default function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-400">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-night-500 border-t-cyan-400" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

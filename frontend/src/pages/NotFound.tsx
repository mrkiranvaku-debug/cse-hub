import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="text-5xl">🧭</p>
      <h1 className="text-2xl font-semibold text-ink">Page not found</h1>
      <p className="text-sm text-muted-400">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-2 rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-night-950 hover:bg-cyan-300">
        Back to Home
      </Link>
    </div>
  )
}

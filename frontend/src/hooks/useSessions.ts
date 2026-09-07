import { useCallback, useEffect, useState } from 'react'
import { sessionService, type SessionFilters } from '../services/sessionService'
import type { Session } from '../types'

export function useSessions(filters: SessionFilters = {}) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filterKey = JSON.stringify(filters)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await sessionService.getAll(filters)
      setSessions(data)
    } catch (err) {
      console.error(err)
      setError('Could not load sessions. Is the backend running?')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { sessions, loading, error, refresh }
}

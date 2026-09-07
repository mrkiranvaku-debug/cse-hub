import { useCallback, useEffect, useState } from 'react'
import { resourceService, type ResourceFilters } from '../services/resourceService'
import type { Resource } from '../types'

export function useResources(filters: ResourceFilters = {}) {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filterKey = JSON.stringify(filters)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await resourceService.getAll(filters)
      setResources(data)
    } catch (err) {
      console.error(err)
      setError('Could not load resources. Is the backend running?')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const handler = () => refresh()
    window.addEventListener('cse-hub:resources-changed', handler)
    return () => window.removeEventListener('cse-hub:resources-changed', handler)
  }, [refresh])

  return { resources, loading, error, refresh }
}

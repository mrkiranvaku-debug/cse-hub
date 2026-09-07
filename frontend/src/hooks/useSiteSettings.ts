import { useCallback, useEffect, useState } from 'react'
import { settingsService } from '../services/settingsService'
import type { SiteSettings } from '../types'

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await settingsService.get()
      setSettings(data)
    } catch (err) {
      console.error(err)
      setError('Could not load site settings.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const handler = () => refresh()
    window.addEventListener('cse-hub:settings-changed', handler)
    return () => window.removeEventListener('cse-hub:settings-changed', handler)
  }, [refresh])

  return { settings, loading, error, refresh }
}

export function notifySettingsChanged() {
  window.dispatchEvent(new Event('cse-hub:settings-changed'))
}

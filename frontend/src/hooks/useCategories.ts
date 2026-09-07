import { useCallback, useEffect, useState } from 'react'
import { categoryService } from '../services/categoryService'
import type { Category } from '../types'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (err) {
      console.error(err)
      setError('Could not load categories. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Lets any part of the app (category management, sidebar, forms) stay in
  // sync after a category is created/renamed/deleted/reordered elsewhere.
  useEffect(() => {
    const handler = () => refresh()
    window.addEventListener('cse-hub:categories-changed', handler)
    return () => window.removeEventListener('cse-hub:categories-changed', handler)
  }, [refresh])

  return { categories, loading, error, refresh }
}

/** Call after any category create/update/delete/reorder so every mounted useCategories() instance refreshes. */
export function notifyCategoriesChanged() {
  window.dispatchEvent(new Event('cse-hub:categories-changed'))
}

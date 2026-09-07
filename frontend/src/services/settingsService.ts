import api from './api'
import type { SiteSettings } from '../types'

export const settingsService = {
  get: () => api.get<SiteSettings>('/settings').then((r) => r.data),
  update: (data: Partial<SiteSettings>) => api.put<SiteSettings>('/settings', data).then((r) => r.data),
  uploadBanner: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post<SiteSettings>('/settings/banner', form).then((r) => r.data)
  },
  removeBanner: () => api.delete<SiteSettings>('/settings/banner').then((r) => r.data),
}

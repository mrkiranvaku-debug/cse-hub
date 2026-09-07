import api from './api'
import type { Session, SessionInput } from '../types'

export interface SessionFilters {
  categoryId?: number
  q?: string
}

export const sessionService = {
  getAll: (filters: SessionFilters = {}) =>
    api.get<Session[]>('/sessions', { params: filters }).then((r) => r.data),
  getById: (id: number) => api.get<Session>(`/sessions/${id}`).then((r) => r.data),
  create: (data: SessionInput) => api.post<Session>('/sessions', data).then((r) => r.data),
  update: (id: number, data: SessionInput) =>
    api.put<Session>(`/sessions/${id}`, data).then((r) => r.data),
  remove: (id: number) => api.delete(`/sessions/${id}`),
}

import api from './api'
import type { Category, CategoryInput } from '../types'

export const categoryService = {
  getAll: () => api.get<Category[]>('/categories').then((r) => r.data),
  getById: (id: number) => api.get<Category>(`/categories/${id}`).then((r) => r.data),
  create: (data: CategoryInput) => api.post<Category>('/categories', data).then((r) => r.data),
  update: (id: number, data: CategoryInput) =>
    api.put<Category>(`/categories/${id}`, data).then((r) => r.data),
  /** reassignToId: required if the category still has resources/sessions attached. */
  remove: (id: number, reassignToId?: number) =>
    api.delete(`/categories/${id}`, { params: reassignToId ? { reassignToId } : {} }),
  reorder: (orderedIds: number[]) =>
    api.put<Category[]>('/categories/reorder', orderedIds).then((r) => r.data),
}

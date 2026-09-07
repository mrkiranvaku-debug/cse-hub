import api from './api'
import type { Resource, ResourceInput, ResourceStatus, ResourceType } from '../types'

export interface ResourceFilters {
  categoryId?: number
  type?: ResourceType
  status?: ResourceStatus
  q?: string
}

export interface UploadResourceInput {
  title: string
  description?: string
  categoryId: number
  resourceType: ResourceType
  status?: ResourceStatus
  tags?: string[]
  file: File
}

export const resourceService = {
  getAll: (filters: ResourceFilters = {}) =>
    api.get<Resource[]>('/resources', { params: filters }).then((r) => r.data),
  getById: (id: number) => api.get<Resource>(`/resources/${id}`).then((r) => r.data),
  create: (data: ResourceInput) => api.post<Resource>('/resources', data).then((r) => r.data),
  update: (id: number, data: ResourceInput) =>
    api.put<Resource>(`/resources/${id}`, data).then((r) => r.data),
  remove: (id: number) => api.delete(`/resources/${id}`),

  /** Creates a new resource from an uploaded PDF / PPT(X) / image instead of a link. */
  uploadNew: (data: UploadResourceInput) => {
    const form = new FormData()
    form.append('title', data.title)
    if (data.description) form.append('description', data.description)
    form.append('categoryId', String(data.categoryId))
    form.append('resourceType', data.resourceType)
    if (data.status) form.append('status', data.status)
    if (data.tags?.length) form.append('tags', data.tags.join(','))
    form.append('file', data.file)
    return api.post<Resource>('/resources/upload', form).then((r) => r.data)
  },

  /** Replaces the uploaded file backing an existing resource. */
  replaceFile: (id: number, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.put<Resource>(`/resources/${id}/file`, form).then((r) => r.data)
  },

  uploadThumbnail: (id: number, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post<Resource>(`/resources/${id}/thumbnail`, form).then((r) => r.data)
  },

  removeThumbnail: (id: number) => api.delete<Resource>(`/resources/${id}/thumbnail`).then((r) => r.data),
}

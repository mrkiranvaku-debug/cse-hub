export type ResourceType =
  | 'VIDEO'
  | 'ARTICLE'
  | 'COURSE'
  | 'GITHUB'
  | 'INTERNSHIP'
  | 'HACKATHON'
  | 'CERTIFICATION'
  | 'PROJECT'
  | 'DOCUMENTATION'
  | 'OTHER'

export type ResourceStatus = 'TO_LEARN' | 'LEARNING' | 'COMPLETED' | 'REFERENCE'

export type ResourceSourceType = 'LINK' | 'FILE'

export interface Category {
  id: number
  name: string
  icon?: string
  groupName?: string
  description?: string
  displayOrder?: number
  resourceCount: number
  sessionCount: number
}

export interface CategoryInput {
  name: string
  icon?: string
  groupName?: string
  description?: string
}

export interface Resource {
  id: number
  title: string
  description?: string
  url?: string
  thumbnailUrl?: string
  categoryId: number
  categoryName?: string
  categoryIcon?: string
  resourceType: ResourceType
  status: ResourceStatus
  tags: string[]
  sourceType: ResourceSourceType
  originalFileName?: string
  fileSize?: number
  fileContentType?: string
  createdAt: string
  updatedAt: string
}

export interface ResourceInput {
  title: string
  description?: string
  url?: string
  thumbnailUrl?: string
  categoryId: number
  resourceType: ResourceType
  status?: ResourceStatus
  tags?: string[]
}

export interface Session {
  id: number
  title: string
  categoryId: number
  categoryName?: string
  categoryIcon?: string
  content?: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface SessionInput {
  title: string
  categoryId: number
  content?: string
  tags?: string[]
}

export interface SiteSettings {
  greeting: string
  subtitle: string
  quoteText: string
  quoteAuthor: string
  supportingText?: string
  bannerTitle: string
  bannerTagline: string
  bannerImageUrl?: string
}

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  VIDEO: 'Video',
  ARTICLE: 'Article',
  COURSE: 'Course',
  GITHUB: 'GitHub Repo',
  INTERNSHIP: 'Internship',
  HACKATHON: 'Hackathon',
  CERTIFICATION: 'Certification',
  PROJECT: 'Project',
  DOCUMENTATION: 'Documentation',
  OTHER: 'Other',
}

export const RESOURCE_STATUS_LABELS: Record<ResourceStatus, string> = {
  TO_LEARN: 'To Learn',
  LEARNING: 'Learning',
  COMPLETED: 'Completed',
  REFERENCE: 'Reference',
}

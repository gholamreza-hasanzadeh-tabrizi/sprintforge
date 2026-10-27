import type { Issue } from '@/types/domain/issue'

export interface IssueActivityFeedProps { issue: Issue; mode: 'activity' | 'comments' }
export interface ActivityRowProps { event: Issue['activity'][number] }
export interface EmptyStateProps { title: string; detail: string }

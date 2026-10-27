import type { Issue, IssuePriority, IssueStatus, View } from '@/types/domain'

export interface ProjectPageProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onToast: (message: string) => void
}

export type ProjectIssueChange = (data: Omit<Issue, 'id' | 'comments' | 'activity' | 'watchers' | 'subtasks'>, id?: string) => void
export type IssueFilters = { assignee: string; priority: IssuePriority | 'all'; status?: IssueStatus | 'all'; query: string }
export type ProjectPageView = View

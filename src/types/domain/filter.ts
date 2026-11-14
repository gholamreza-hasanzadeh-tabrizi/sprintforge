import type { IssuePriority, IssueStatus } from './issue'

export interface IssueFilterCriteria {
  status: IssueStatus | 'all'
  priority: IssuePriority | 'all'
  /** Matches any of these priorities. Use for "this priority or higher" style filters. */
  priorityIn?: IssuePriority[]
  assignee: string | 'all'
  query: string
  openOnly?: boolean
  dueWithinDays?: number
}

export interface SavedIssueFilter extends IssueFilterCriteria {
  id: string
  name: string
}

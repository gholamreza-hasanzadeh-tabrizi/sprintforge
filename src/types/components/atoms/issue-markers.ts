import type { IssuePriority, IssueType } from '@/types/domain/issue'

export interface PriorityMarkProps { priority: IssuePriority }
export interface IssueTypeMarkProps { type: IssueType; className?: string }

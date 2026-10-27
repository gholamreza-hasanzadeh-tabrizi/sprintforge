import type { Issue } from '@/types/domain/issue'

export interface IssueCardProps {
  issue: Issue
  onOpen: (id: string) => void
  onDragStart: (id: string) => void
}

import type { Issue } from '@/types/domain/issue'

export interface IssueListProps {
  issues: Issue[]
  onOpen: (id: string) => void
  onSort: () => void
}

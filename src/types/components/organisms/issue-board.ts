import type { Issue, IssueStatus } from '@/types/domain/issue'

export interface IssueBoardProps {
  issues: Issue[]
  onOpen: (id: string) => void
  onMove: (id: string, status: IssueStatus) => void
  onCreate: () => void
  onToast: (message: string) => void
}

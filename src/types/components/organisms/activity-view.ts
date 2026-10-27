import type { Issue } from '@/types/domain/issue'

export interface ActivityViewProps {
  issues: Issue[]
  onOpen: (issueId: string) => void
}

export interface ActivityFeedEntry {
  id: string
  issueId: string
  issueTitle: string
  actor: string
  action: string
  createdAt: string
  comment?: string
}

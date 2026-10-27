import type { Issue } from '@/types/domain/issue'

export interface CalendarViewProps {
  issues: Issue[]
  onOpen: (issueId: string) => void
}

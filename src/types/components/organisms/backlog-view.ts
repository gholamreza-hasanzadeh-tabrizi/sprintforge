import type { Issue } from '@/types/domain/issue'

export interface BacklogViewProps {
  issues: Issue[]
  onOpen: (id: string) => void
  onCreate: () => void
  onToast: (message: string) => void
}

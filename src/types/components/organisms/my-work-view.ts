import type { LucideIcon } from 'lucide-react'
import type { Issue } from '@/types/domain/issue'

export interface MyWorkViewProps {
  issues: Issue[]
  onOpen: (issueId: string) => void
  currentUser?: string
}

export interface MyWorkSummaryProps {
  label: string
  value: number
  Icon: LucideIcon
  alert?: boolean
}

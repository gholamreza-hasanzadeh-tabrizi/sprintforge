import type { FormEvent } from 'react'
import type { Issue } from '@/types/domain/issue'

export interface FiltersViewProps {
  issues: Issue[]
  onOpen: (issueId: string) => void
}

export type FiltersSubmitEvent = FormEvent<HTMLFormElement>

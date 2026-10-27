import type { Subtask } from '@/types/domain/issue'

export interface SubtaskListProps {
  subtasks: Subtask[]
  onAdd: (title: string) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

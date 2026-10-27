import type { Issue, IssueDraft } from '@/types/domain/issue'

export interface IssueDialogProps {
  open: boolean
  issue: Issue | null
  onOpenChange: (open: boolean) => void
  onSave: (data: IssueDraft, id?: string) => void
  onAddComment: (issueId: string, body: string) => void
  onToggleWatch: (issueId: string) => void
  onAddSubtask: (issueId: string, title: string) => void
  onToggleSubtask: (issueId: string, subtaskId: string) => void
  onDeleteSubtask: (issueId: string, subtaskId: string) => void
  onToast: (message: string) => void
}

import { ArrowDown, ArrowUp, ChevronsUp, Circle, SquareCheckBig, Bug, Sparkles } from 'lucide-react'
import type { IssuePriority, IssueType } from '@/types/domain/issue'
import type { IssueTypeMarkProps, PriorityMarkProps } from '@/types/components/atoms/issue-markers'
import { cn } from '@/lib/utils'

const priorityConfig: Record<IssuePriority, { Icon: typeof ArrowUp; color: string }> = {
  Highest: { Icon: ChevronsUp, color: 'text-rose-500' },
  High: { Icon: ArrowUp, color: 'text-orange-500' },
  Medium: { Icon: ArrowUp, color: 'text-amber-500' },
  Low: { Icon: ArrowDown, color: 'text-blue-500' },
}

export function PriorityMark({ priority }: PriorityMarkProps) {
  const { Icon, color } = priorityConfig[priority]
  return <Icon size={15} strokeWidth={2.4} className={color} aria-label={`${priority} priority`} />
}

const typeConfig: Record<IssueType, { Icon: typeof Circle; color: string }> = {
  Story: { Icon: Circle, color: 'text-emerald-600 dark:text-emerald-400' },
  Task: { Icon: SquareCheckBig, color: 'text-blue-600 dark:text-blue-400' },
  Bug: { Icon: Bug, color: 'text-rose-600 dark:text-rose-400' },
  Epic: { Icon: Sparkles, color: 'text-violet-600 dark:text-violet-400' },
}

export function IssueTypeMark({ type, className }: IssueTypeMarkProps) {
  const { Icon, color } = typeConfig[type]
  return <Icon size={15} strokeWidth={2.2} className={cn(color, className)} aria-label={type} />
}

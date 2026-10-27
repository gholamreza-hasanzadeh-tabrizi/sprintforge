import { memo } from 'react'
import { ListChecks, MessageSquare } from 'lucide-react'
import type { IssueCardProps } from '@/types/components/molecules/issue-card'
import { Avatar } from '@/components/atoms/avatar'
import { IssueTypeMark, PriorityMark } from '@/components/atoms/issue-markers'
import { Badge } from '@/components/atoms/badge'

export const IssueCard = memo(function IssueCard({ issue, onOpen, onDragStart }: IssueCardProps) {
  return <article draggable onDragStart={() => onDragStart(issue.id)} onClick={() => onOpen(issue.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpen(issue.id) } }} tabIndex={0} role="button" aria-label={`${issue.id}: ${issue.title}`} className="group cursor-grab rounded-lg border border-border bg-card p-3 shadow-sm transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md active:cursor-grabbing">
    <div className="flex items-center justify-between gap-2"><span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground"><IssueTypeMark type={issue.type} />{issue.id}</span><button onClick={(event) => { event.stopPropagation(); onOpen(issue.id) }} aria-label={`Open ${issue.id}`} className="rounded p-1 text-muted-foreground opacity-0 transition hover:bg-muted group-hover:opacity-100 focus:opacity-100"><span aria-hidden>···</span></button></div>
    <h3 className="mt-2 line-clamp-2 min-h-10 text-[13px] font-medium leading-5 text-foreground">{issue.title}</h3>
    <div className="mt-2 flex min-h-5 flex-wrap gap-1">{issue.labels.slice(0, 2).map((label) => <Badge key={label} className="border-transparent bg-primary/10 px-1.5 py-0 text-[9px] text-primary">{label}</Badge>)}</div>
    <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-2.5"><div className="flex items-center gap-2"><PriorityMark priority={issue.priority} /><span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{issue.points} pts</span>{issue.comments.length > 0 && <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"><MessageSquare size={12}/>{issue.comments.length}</span>}{issue.subtasks.length > 0 && <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground" title="Completed subtasks"><ListChecks size={12}/>{issue.subtasks.filter((subtask) => subtask.done).length}/{issue.subtasks.length}</span>}</div><Avatar name={issue.assignee} size="sm" /></div>
  </article>
})

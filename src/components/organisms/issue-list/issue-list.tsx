import { memo } from 'react'
import { ArrowDownUp } from 'lucide-react'
import type { IssueListProps } from '@/types/components/organisms/issue-list'
import { statusMeta } from '@/data'
import { Button } from '@/components/atoms/button'
import { Avatar } from '@/components/atoms/avatar'
import { StatusBadge } from '@/components/atoms/badge'
import { IssueTypeMark, PriorityMark } from '@/components/atoms/issue-markers'

export const IssueList = memo(function IssueList({ issues, onOpen, onSort }: IssueListProps) {
  return <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"><div className="flex h-12 items-center justify-between border-b border-border px-4"><h2 className="flex items-center gap-2 text-sm font-semibold">All issues <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground">{issues.length}</span></h2><Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={onSort}><ArrowDownUp size={14}/>Sort</Button></div><div className="overflow-x-auto"><div className="min-w-[760px]"><div className="grid grid-cols-[42px_minmax(240px,1fr)_130px_120px_150px_60px] items-center gap-2 bg-muted/40 px-4 py-2 text-[9px] font-semibold tracking-wide text-muted-foreground"><span>TYPE</span><span>ISSUE</span><span>STATUS</span><span>PRIORITY</span><span>ASSIGNEE</span><span>POINTS</span></div>{issues.map((issue) => <button key={issue.id} onClick={() => onOpen(issue.id)} className="grid min-h-12 w-full grid-cols-[42px_minmax(240px,1fr)_130px_120px_150px_60px] items-center gap-2 border-t border-border/70 px-4 py-2 text-left text-xs text-muted-foreground transition hover:bg-muted/40"><span><IssueTypeMark type={issue.type}/></span><span className="min-w-0"><span className="mr-2 text-[10px] text-muted-foreground">{issue.id}</span><span className="font-medium text-foreground">{issue.title}</span></span><span><StatusBadge status={issue.status} label={statusMeta[issue.status].label}/></span><span className="flex items-center gap-1.5"><PriorityMark priority={issue.priority}/>{issue.priority}</span><span className="flex items-center gap-2"><Avatar name={issue.assignee} size="sm"/>{issue.assignee}</span><span>{issue.points}</span></button>)}</div></div></section>
})

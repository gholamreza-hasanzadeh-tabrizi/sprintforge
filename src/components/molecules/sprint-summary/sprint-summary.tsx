import { ChevronDown, MoreHorizontal } from 'lucide-react'
import type { SprintSummaryProps } from '@/types/components/molecules/sprint-summary'
import { Button } from '@/components/atoms/button'
import { Badge } from '@/components/atoms/badge'

export function SprintSummary({ issues, onMore }: SprintSummaryProps) {
  const done = issues.filter((issue) => issue.status === 'done')
  const allPoints = issues.reduce((sum, issue) => sum + issue.points, 0)
  const donePoints = done.reduce((sum, issue) => sum + issue.points, 0)
  const percent = allPoints ? Math.round(donePoints / allPoints * 100) : 0
  return <section className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
    <div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-md bg-muted text-muted-foreground"><ChevronDown size={16}/></span><div><div className="flex items-center gap-2 text-sm font-semibold">Sprint 24 <Badge className="border-emerald-200 bg-emerald-50 text-[9px] uppercase tracking-wide text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">Active</Badge></div><p className="mt-0.5 text-[11px] text-muted-foreground">Jan 20 – Feb 3 <span className="px-1">·</span> 9 days remaining</p></div></div>
    <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-xs font-semibold">{donePoints} / {allPoints} pts</p><p className="mt-0.5 text-[10px] text-muted-foreground">{done.length} of {issues.length} issues complete</p></div><div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }}/></div><Button variant="ghost" size="icon" className="size-8" onClick={onMore} aria-label="Sprint actions"><MoreHorizontal size={17}/></Button></div>
  </section>
}

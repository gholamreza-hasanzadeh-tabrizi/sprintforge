import { memo, useMemo, useState } from 'react'
import { MoreHorizontal, Plus } from 'lucide-react'
import type { Issue, IssueStatus } from '@/types/domain/issue'
import type { IssueBoardProps } from '@/types/components/organisms/issue-board'
import { statusMeta } from '@/data'
import { Button } from '@/components/atoms/button'
import { IssueCard } from '@/components/molecules/issue-card'

const statuses: IssueStatus[] = ['todo', 'progress', 'review', 'done']

export const IssueBoard = memo(function IssueBoard({ issues, onOpen, onMove, onCreate, onToast }: IssueBoardProps) {
  const [dragged, setDragged] = useState<string | null>(null)
  const grouped = useMemo(() => Object.fromEntries(statuses.map((status) => [status, issues.filter((issue) => issue.status === status)])) as Record<IssueStatus, Issue[]>, [issues])
  return <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-2 2xl:grid-cols-4">{statuses.map((status) => {
    const meta = statusMeta[status]
    const group = grouped[status]
    return <section key={status} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (dragged) onMove(dragged, status); setDragged(null) }} className="min-h-40 rounded-lg border border-border bg-muted/60 p-2.5 transition-colors">
      <div className="mb-2 flex h-8 items-center justify-between px-0.5"><div className="flex items-center gap-2"><span className="size-2 rounded-full" style={{ background: meta.color }}/><h2 className="text-xs font-semibold">{meta.label}</h2><span className="rounded bg-background/80 px-1.5 py-0.5 text-[10px] text-muted-foreground">{group.length}</span></div><div className="flex items-center"><Button variant="ghost" size="icon" className="size-7 text-muted-foreground" aria-label={`Add an issue to ${meta.label}`} onClick={onCreate}><Plus size={15}/></Button><Button variant="ghost" size="icon" className="size-7 text-muted-foreground" aria-label={`${meta.label} options`} onClick={() => onToast(`${meta.label} column options`)}><MoreHorizontal size={15}/></Button></div></div>
      <div className="flex flex-col gap-2">{group.map((issue) => <IssueCard key={issue.id} issue={issue} onOpen={onOpen} onDragStart={setDragged}/>)}</div>
      <button onClick={onCreate} className="mt-2 flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-xs text-muted-foreground transition hover:bg-background hover:text-foreground"><Plus size={14}/> Add an issue</button>
    </section>
  })}</div>
})

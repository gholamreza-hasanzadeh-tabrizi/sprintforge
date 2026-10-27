import { CalendarClock, CheckCircle2, CircleDot, ListTodo } from 'lucide-react'
import type { MyWorkSummaryProps, MyWorkViewProps } from '@/types/components/organisms/my-work-view'
import { statusMeta } from '@/data'
import { PriorityMark } from '@/components/atoms/issue-markers'
import { StatusBadge } from '@/components/atoms/badge'

const columns = [
  { status: 'todo' as const, label: 'To do', Icon: ListTodo },
  { status: 'progress' as const, label: 'In progress', Icon: CircleDot },
  { status: 'review' as const, label: 'In review', Icon: CheckCircle2 },
]

function localDateString(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function MyWorkView({ issues, onOpen, currentUser = 'Olivia Chen' }: MyWorkViewProps) {
  const assigned = issues.filter((issue) => issue.assignee === currentUser)
  const openIssues = assigned.filter((issue) => issue.status !== 'done')
  const overdue = openIssues.filter((issue) => issue.due && issue.due < localDateString()).length
  const done = assigned.filter((issue) => issue.status === 'done').length

  return <div className="space-y-5">
    <div><h2 className="font-[family-name:var(--font-display)] text-lg font-bold">My work</h2><p className="mt-1 text-xs text-muted-foreground">Your issues across the project, grouped by their current status.</p></div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Summary label="Open issues" value={openIssues.length} Icon={ListTodo}/>
      <Summary label="In progress" value={assigned.filter((issue) => issue.status === 'progress').length} Icon={CircleDot}/>
      <Summary label="Completed" value={done} Icon={CheckCircle2}/>
      <Summary label="Past due" value={overdue} Icon={CalendarClock} alert={overdue > 0}/>
    </div>
    <div className="grid gap-4 lg:grid-cols-3">
      {columns.map(({ status, label, Icon }) => {
        const items = assigned.filter((issue) => issue.status === status)
        return <section key={status} className="overflow-hidden rounded-xl border border-border bg-card">
          <header className="flex items-center justify-between border-b border-border px-4 py-3"><h3 className="flex items-center gap-2 text-xs font-semibold"><Icon size={15} className="text-primary"/>{label}</h3><span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{items.length}</span></header>
          <div className="divide-y divide-border/70">
            {items.length ? items.map((issue) => <button key={issue.id} onClick={() => onOpen(issue.id)} className="block w-full px-4 py-3 text-left transition hover:bg-muted/40"><div className="flex items-center justify-between gap-2"><span className="text-[10px] font-medium text-muted-foreground">{issue.id}</span><StatusBadge status={issue.status} label={statusMeta[issue.status].label}/></div><p className="mt-1.5 text-xs font-medium text-foreground">{issue.title}</p><div className="mt-2 flex items-center gap-2"><PriorityMark priority={issue.priority}/><span className="text-[10px] text-muted-foreground">{issue.priority}</span>{issue.due && <span className="ml-auto text-[10px] text-muted-foreground">Due {issue.due}</span>}</div></button>) : <p className="px-4 py-8 text-center text-[11px] text-muted-foreground">Nothing here right now.</p>}
          </div>
        </section>
      })}
    </div>
    {assigned.some((issue) => issue.status === 'done') && <section className="rounded-xl border border-border bg-card p-4"><h3 className="text-xs font-semibold">Recently completed</h3><div className="mt-3 flex flex-wrap gap-2">{assigned.filter((issue) => issue.status === 'done').map((issue) => <button key={issue.id} onClick={() => onOpen(issue.id)} className="rounded-md border border-border px-3 py-2 text-left hover:bg-muted"><span className="block text-[10px] text-muted-foreground">{issue.id}</span><span className="mt-1 block text-xs font-medium">{issue.title}</span></button>)}</div></section>}
  </div>
}

function Summary({ label, value, Icon, alert = false }: MyWorkSummaryProps) {
  return <div className="rounded-xl border border-border bg-card p-3 sm:p-4"><div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground">{label}</span><Icon size={15} className={alert ? 'text-rose-500' : 'text-primary'}/></div><p className="mt-2 text-xl font-bold tabular-nums">{value}</p></div>
}

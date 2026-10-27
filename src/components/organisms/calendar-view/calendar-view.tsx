import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { CalendarViewProps } from '@/types/components/organisms/calendar-view'

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function CalendarView({ issues, onOpen }: CalendarViewProps) {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const monthLabel = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(month)
  const dueIssues = useMemo(() => issues.filter((issue) => issue.due), [issues])
  const byDate = useMemo(() => {
    const entries = new Map<string, typeof dueIssues>()
    for (const issue of dueIssues) entries.set(issue.due!, [...(entries.get(issue.due!) ?? []), issue])
    return entries
  }, [dueIssues])
  const firstWeekday = new Date(month.getFullYear(), month.getMonth(), 1).getDay()
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7
  const todayKey = dateKey(new Date())
  const days = Array.from({ length: cellCount }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index - firstWeekday + 1))

  return <div className="space-y-5">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-[family-name:var(--font-display)] text-lg font-bold">Calendar</h2><p className="mt-1 text-xs text-muted-foreground">Plan around issue due dates and upcoming milestones.</p></div><div className="flex items-center gap-2"><button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="Previous month" className="grid size-8 place-items-center rounded-md border border-border hover:bg-muted"><ChevronLeft size={16}/></button><p className="min-w-32 text-center text-sm font-semibold">{monthLabel}</p><button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Next month" className="grid size-8 place-items-center rounded-md border border-border hover:bg-muted"><ChevronRight size={16}/></button><button onClick={() => setMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1))} className="ml-1 h-8 rounded-md border border-border px-3 text-[11px] font-medium hover:bg-muted">Today</button></div></div>
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="grid grid-cols-7 border-b border-border bg-muted/30">{weekdays.map((day) => <div key={day} className="px-2 py-2.5 text-center text-[10px] font-semibold text-muted-foreground">{day}</div>)}</div>
      <div className="grid grid-cols-7">{days.map((date) => {
        const key = dateKey(date)
        const inMonth = date.getMonth() === month.getMonth()
        const issuesDue = byDate.get(key) ?? []
        return <div key={key} className={`min-h-24 border-b border-r border-border/70 p-1.5 sm:min-h-28 sm:p-2 ${inMonth ? '' : 'bg-muted/20 text-muted-foreground'}`}><div className="mb-1 flex justify-end"><span className={`grid size-6 place-items-center rounded-full text-[10px] ${key === todayKey ? 'bg-primary font-semibold text-primary-foreground' : ''}`}>{date.getDate()}</span></div><div className="space-y-1">{issuesDue.slice(0, 3).map((issue) => <button key={issue.id} onClick={() => onOpen(issue.id)} title={`${issue.id}: ${issue.title}`} className="block w-full truncate rounded bg-primary/10 px-1.5 py-1 text-left text-[9px] font-medium text-primary hover:bg-primary/20">{issue.id} · {issue.title}</button>)}{issuesDue.length > 3 && <p className="px-1 text-[9px] text-muted-foreground">+{issuesDue.length - 3} more</p>}</div></div>
      })}</div>
    </section>
    <section className="rounded-xl border border-border bg-card p-4"><h3 className="flex items-center gap-2 text-xs font-semibold"><CalendarDays size={15} className="text-primary"/>Upcoming due dates</h3>{dueIssues.length ? <div className="mt-3 divide-y divide-border/70">{[...dueIssues].sort((a, b) => (a.due ?? '').localeCompare(b.due ?? '')).slice(0, 5).map((issue) => <button key={issue.id} onClick={() => onOpen(issue.id)} className="flex w-full items-center justify-between gap-3 py-2 text-left hover:text-primary"><span className="min-w-0"><span className="mr-2 text-[10px] text-muted-foreground">{issue.id}</span><span className="text-xs font-medium">{issue.title}</span></span><time className="shrink-0 text-[10px] text-muted-foreground" dateTime={issue.due}>{issue.due}</time></button>)}</div> : <p className="mt-3 text-[11px] text-muted-foreground">No due dates yet. Add a due date from an issue’s details.</p>}</section>
  </div>
}

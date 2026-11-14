import { memo } from 'react'
import { Activity, ArrowUpRight, CheckCircle2, Clock3 } from 'lucide-react'
import type { MetricProps, ReportsViewProps } from '@/types/components/organisms/reports-view'
import { people, statusMeta } from '@/data'
import { Avatar } from '@/components/atoms/avatar'
import { Button } from '@/components/atoms/button'

export const ReportsView = memo(function ReportsView({ issues, onToast, onOpen, onViewActivity }: ReportsViewProps) {
  const complete = issues.filter((issue) => issue.status === 'done')
  const points = issues.reduce((sum, issue) => sum + issue.points, 0)
  const donePoints = complete.reduce((sum, issue) => sum + issue.points, 0)
  const percent = points ? Math.round(donePoints / points * 100) : 0
  const events = issues.flatMap((issue) => issue.activity.map((event) => ({ ...event, issueId: issue.id, issueTitle: issue.title }))).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4)
  const statusCounts = Object.entries(statusMeta).map(([status, meta]) => ({ status, label: meta.label, color: meta.color, count: issues.filter((issue) => issue.status === status).length }))
  return <div className="space-y-4"><div className="flex items-end justify-between"><div><p className="mb-1 text-[10px] font-semibold tracking-[.13em] text-muted-foreground">SPRINT INSIGHTS</p><h2 className="text-xl font-semibold tracking-tight">Progress at a glance</h2><p className="mt-1 text-xs text-muted-foreground">A live snapshot of issue status and completed story points.</p></div><Button variant="outline" size="sm" onClick={() => exportReport(issues, onToast)}><ArrowUpRight size={14}/>Export CSV</Button></div>
    <div className="grid gap-3 md:grid-cols-3"><Metric title="SPRINT COMPLETION" value={`${percent}%`} detail="of current story points completed" progress={percent} /><Metric title="ISSUES COMPLETED" value={`${complete.length} / ${issues.length}`} detail={`${issues.length - complete.length} still in progress`} progress={issues.length ? complete.length / issues.length * 100 : 0} green/><div className="relative min-h-32 overflow-hidden rounded-lg border border-border bg-card p-4"><p className="text-[10px] font-semibold tracking-wide text-muted-foreground">SPRINT CAPACITY</p><p className="mt-2 text-3xl font-semibold tracking-tight">{points}<span className="ml-1 text-sm font-normal text-muted-foreground">pts</span></p><p className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground"><Clock3 size={13}/>Across {people.length} team members</p><div className="absolute bottom-4 right-4 flex">{people.slice(0, 5).map((person) => <Avatar key={person.name} name={person.name} size="sm" className="-ml-1 first:ml-0"/>)}</div></div></div>
    <section className="rounded-lg border border-border bg-card p-4"><div className="mb-4"><h3 className="text-sm font-semibold">Issue status distribution</h3><p className="mt-1 text-[10px] text-muted-foreground">Current workflow state across all project issues</p></div><div className="space-y-4">{statusCounts.map((item) => { const percent = issues.length ? Math.round(item.count / issues.length * 100) : 0; return <div key={item.status}><div className="mb-1.5 flex items-center justify-between text-[11px]"><span className="font-medium">{item.label}</span><span className="text-muted-foreground">{item.count} · {percent}%</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full transition-all" style={{ width: `${percent}%`, backgroundColor: item.color }}/></div></div>})}</div></section>
    <section className="rounded-lg border border-border bg-card p-4"><div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-semibold">Recent activity</h3><button className="text-[10px] text-primary" onClick={onViewActivity}>View all <ArrowUpRight size={12} className="inline"/></button></div>{events.length ? events.map((event) => <button key={event.id} onClick={() => onOpen(event.issueId)} className="flex min-h-11 w-full items-center gap-2.5 border-t border-border/70 text-left hover:bg-muted/30"><Avatar name={event.actor} size="sm"/><p className="min-w-0 flex-1 truncate text-[11px] text-muted-foreground"><strong className="font-medium text-foreground">{event.actor}</strong> {event.action} <b className="font-medium text-primary">{event.issueId}</b></p><span className="whitespace-nowrap text-[9px] text-muted-foreground">{relativeTime(event.createdAt)}</span></button>) : <p className="py-5 text-center text-xs text-muted-foreground">No recent activity yet.</p>}</section>
  </div>
})

function relativeTime(value: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60_000))
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`
  return `${Math.floor(hours / 24)} days ago`
}

function exportReport(issues: ReportsViewProps['issues'], onToast: ReportsViewProps['onToast']) {
  const columns = ['Issue', 'Summary', 'Status', 'Priority', 'Type', 'Assignee', 'Story points', 'Labels', 'Due date']
  const escape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`
  const rows = issues.map((issue) => [issue.id, issue.title, statusMeta[issue.status].label, issue.priority, issue.type, issue.assignee, issue.points, issue.labels.join('; '), issue.due ?? ''])
  // A BOM keeps non-ASCII text readable when the file is opened in Excel.
  const csv = `\uFEFF${[columns, ...rows].map((row) => row.map(escape).join(',')).join('\r\n')}`
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'sprintforge-issues.csv'
  document.body.appendChild(link)
  link.click()
  link.remove()
  // Revoking in the same tick cancels the download in Firefox and Safari.
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
  onToast('CSV report downloaded')
}

function Metric({ title, value, detail, progress, green = false }: MetricProps) {
  return <div className="relative min-h-32 overflow-hidden rounded-lg border border-border bg-card p-4"><p className="text-[10px] font-semibold tracking-wide text-muted-foreground">{title}</p><p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p><p className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">{green ? <CheckCircle2 size={13}/> : <Activity size={13}/>} {detail}</p><div className="absolute inset-x-0 bottom-0 h-1 bg-muted"><span className={`block h-full ${green ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${progress}%` }}/></div></div>
}

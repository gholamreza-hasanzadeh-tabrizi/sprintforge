import { Activity, MessageSquareText } from 'lucide-react'
import type { Issue } from '@/types/domain/issue'
import type { ActivityFeedEntry, ActivityViewProps } from '@/types/components/organisms/activity-view'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value))
}

function makeFeed(issues: Issue[]): ActivityFeedEntry[] {
  return issues.flatMap((issue) => issue.activity.map((event) => {
    const comment = event.commentId ? issue.comments.find((item) => item.id === event.commentId)?.body : undefined
    return { id: event.id, issueId: issue.id, issueTitle: issue.title, actor: event.actor, action: event.action, createdAt: event.createdAt, comment }
  })).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 40)
}

export function ActivityView({ issues, onOpen }: ActivityViewProps) {
  const entries = makeFeed(issues)
  return <div className="space-y-5">
    <div><h2 className="font-[family-name:var(--font-display)] text-lg font-bold">Project activity</h2><p className="mt-1 text-xs text-muted-foreground">A timeline of recent comments and issue changes.</p></div>
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3"><h3 className="flex items-center gap-2 text-xs font-semibold"><Activity size={15} className="text-primary"/>Recent updates</h3><span className="text-[10px] text-muted-foreground">Latest {entries.length}</span></div>
      {entries.length ? <div className="divide-y divide-border/70">{entries.map((entry) => <button key={`${entry.issueId}-${entry.id}`} onClick={() => onOpen(entry.issueId)} className="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-muted/40"><span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">{entry.comment ? <MessageSquareText size={15}/> : <Activity size={15}/>}</span><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-x-1 text-xs"><strong className="font-semibold">{entry.actor}</strong><span className="text-muted-foreground">{entry.action} on</span><strong className="font-semibold text-primary">{entry.issueId}</strong></span><span className="mt-1 block truncate text-[11px] text-foreground">{entry.comment || entry.issueTitle}</span><time dateTime={entry.createdAt} className="mt-1 block text-[10px] text-muted-foreground">{formatDate(entry.createdAt)}</time></span></button>)}</div> : <p className="p-8 text-center text-xs text-muted-foreground">No project activity yet.</p>}
    </section>
  </div>
}

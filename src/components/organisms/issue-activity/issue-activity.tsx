import { memo, useMemo } from 'react'
import { CheckCircle2, CircleDot, Pencil, PlusCircle } from 'lucide-react'
import type { ActivityRowProps, EmptyStateProps, IssueActivityFeedProps } from '@/types/components/organisms/issue-activity'
import { CommentItem } from '@/components/molecules/comment-item'

function relativeTime(value: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60_000))
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
  return `${Math.floor(minutes / 1440)}d ago`
}

function ActivityRow({ event }: ActivityRowProps) {
  const Icon = event.action.startsWith('created') ? PlusCircle : event.action.startsWith('moved') ? CircleDot : event.action.startsWith('updated') ? Pencil : CheckCircle2
  return <div className="flex gap-3 py-3"><span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-border bg-muted text-muted-foreground"><Icon size={13}/></span><div className="min-w-0 flex-1"><p className="text-xs text-foreground"><strong className="font-semibold">{event.actor}</strong> {event.action}</p><time dateTime={event.createdAt} className="mt-1 block text-[10px] text-muted-foreground">{relativeTime(event.createdAt)}</time></div></div>
}

export const IssueActivityFeed = memo(function IssueActivityFeed({ issue, mode }: IssueActivityFeedProps) {
  const commentsById = useMemo(() => new Map(issue.comments.map((comment) => [comment.id, comment])), [issue.comments])
  const entries = useMemo(() => [...issue.activity].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [issue.activity])
  if (mode === 'comments') {
    const comments = [...issue.comments].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    if (!comments.length) return <EmptyState title="No comments yet" detail="Start the conversation with your team."/>
    return <div className="divide-y divide-border/70">{comments.map((comment) => <CommentItem key={comment.id} comment={comment}/>)}</div>
  }
  if (!entries.length) return <EmptyState title="No activity yet" detail="Updates to this issue will appear here."/>
  return <div className="divide-y divide-border/70">{entries.map((event) => {
    const comment = event.commentId ? commentsById.get(event.commentId) : undefined
    return comment ? <div key={event.id} className="border-l border-border pl-3"><CommentItem comment={comment} compact/></div> : <ActivityRow key={event.id} event={event}/>
  })}</div>
})

function EmptyState({ title, detail }: EmptyStateProps) {
  return <div className="grid min-h-36 place-items-center rounded-lg border border-dashed border-border px-4 text-center"><div><p className="text-xs font-semibold">{title}</p><p className="mt-1 text-[11px] text-muted-foreground">{detail}</p></div></div>
}

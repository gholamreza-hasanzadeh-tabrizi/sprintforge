import { memo } from 'react'
import { Avatar } from '@/components/atoms/avatar'
import type { CommentItemProps } from '@/types/components/molecules/comment-item'

function relativeTime(value: string) {
  const seconds = Math.max(0, (Date.now() - new Date(value).getTime()) / 1000)
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  if (seconds < 60) return formatter.format(-Math.floor(seconds), 'second')
  if (seconds < 3600) return formatter.format(-Math.floor(seconds / 60), 'minute')
  if (seconds < 86400) return formatter.format(-Math.floor(seconds / 3600), 'hour')
  if (seconds < 604800) return formatter.format(-Math.floor(seconds / 86400), 'day')
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value))
}

export const CommentItem = memo(function CommentItem({ comment, compact = false }: CommentItemProps) {
  return <article className={`flex gap-3 ${compact ? 'py-2.5' : 'py-4'}`}>
    <Avatar name={comment.author} size="sm" className="mt-0.5"/>
    <div className="min-w-0 flex-1"><div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5"><strong className="text-xs font-semibold text-foreground">{comment.author}</strong><time dateTime={comment.createdAt} title={new Date(comment.createdAt).toLocaleString()} className="text-[10px] text-muted-foreground">{relativeTime(comment.createdAt)}</time>{comment.editedAt && <span className="text-[9px] text-muted-foreground">(edited)</span>}</div><p className="mt-1 whitespace-pre-wrap break-words text-xs leading-5 text-foreground/90">{comment.body}</p></div>
  </article>
})

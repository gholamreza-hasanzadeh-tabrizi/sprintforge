import * as Dialog from '@radix-ui/react-dialog'
import { CalendarDays, X } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import type { Issue, IssueDraft, IssuePriority, IssueStatus, IssueType } from '@/types/domain/issue'
import type { IssueDialogProps } from '@/types/components/organisms/issue-dialog'
import { people, statusMeta } from '@/data'
import { Avatar } from '@/components/atoms/avatar'
import { Badge, StatusBadge } from '@/components/atoms/badge'
import { Button, IconButton } from '@/components/atoms/button'
import { FieldLabel, Input, Select, Textarea } from '@/components/atoms/form-field'
import { IssueTypeMark, PriorityMark } from '@/components/atoms/issue-markers'
import { CommentComposer } from '@/components/organisms/comment-composer'
import { IssueActivityFeed } from '@/components/organisms/issue-activity'
import { SubtaskList } from '@/components/molecules/subtask-list'
import { WatchButton } from '@/components/molecules/watch-button'

const statuses: IssueStatus[] = ['todo', 'progress', 'review', 'done']
const priorities: IssuePriority[] = ['Highest', 'High', 'Medium', 'Low']
const types: IssueType[] = ['Story', 'Task', 'Bug', 'Epic']
type DetailTab = 'activity' | 'comments'

function emptyDraft(): IssueDraft {
  return { title: '', description: '', status: 'todo', priority: 'Medium', type: 'Task', assignee: people[0].name, color: people[0].color, points: 3, labels: [], due: '' }
}
function draftFromIssue(issue: Issue): IssueDraft {
  const { id: _id, comments: _comments, activity: _activity, watchers: _watchers, subtasks: _subtasks, ...draft } = issue
  return draft
}

export function IssueDialog({ open, issue, onOpenChange, onSave, onAddComment, onToggleWatch, onAddSubtask, onToggleSubtask, onDeleteSubtask, onToast }: IssueDialogProps) {
  const [draft, setDraft] = useState<IssueDraft>(() => issue ? draftFromIssue(issue) : emptyDraft())
  const [editing, setEditing] = useState(!issue)
  const [tab, setTab] = useState<DetailTab>('activity')
  const createdAt = issue?.activity.find((entry) => entry.action.startsWith('created'))?.createdAt
  const updatedAt = issue?.activity.at(-1)?.createdAt

  useEffect(() => {
    if (!open) return
    setDraft(issue ? draftFromIssue(issue) : emptyDraft())
    setEditing(!issue)
    setTab('activity')
  }, [open, issue?.id])

  function update<K extends keyof IssueDraft>(key: K, value: IssueDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
  }
  function save() {
    const title = draft.title.trim()
    if (!title) return
    onSave({ ...draft, title, labels: draft.labels.map((label) => label.trim()).filter(Boolean) }, issue?.id)
  }

  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out" />
      <Dialog.Content aria-describedby="issue-dialog-description" className="fixed left-1/2 top-1/2 z-50 flex max-h-[92vh] w-[min(1040px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl focus:outline-none max-sm:max-h-[96vh] max-sm:w-[calc(100vw-12px)]">
        <div className="flex min-h-12 items-center justify-between border-b border-border px-4 sm:px-5"><div className="flex min-w-0 items-center gap-2 text-[11px] text-muted-foreground"><span className="grid size-5 place-items-center rounded bg-primary text-[9px] font-bold text-primary-foreground">N</span><span className="hidden sm:inline">Nova mobile app</span><span className="text-border">/</span><Dialog.Title className="truncate font-semibold text-primary">{issue?.id ?? 'New issue'}</Dialog.Title></div><div className="flex items-center gap-1.5">{issue && <WatchButton watching={issue.watchers.includes('Olivia Chen')} count={issue.watchers.length} onToggle={() => onToggleWatch(issue.id)}/>}<IconButton label="Close issue details" size="icon-sm" onClick={() => onOpenChange(false)}><X size={16}/></IconButton></div><Dialog.Description id="issue-dialog-description" className="sr-only">Issue details, fields, activity, and comments.</Dialog.Description></div>

        {!issue ? <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6"><div className="mx-auto max-w-2xl"><div className="mb-5 flex items-center gap-2"><IssueTypeMark type={draft.type}/><span className="text-xs font-medium text-muted-foreground">Create issue</span></div><h2 className="mb-5 text-lg font-semibold">Create a new task</h2><div className="space-y-4"><div><FieldLabel htmlFor="new-issue-title" required>Summary</FieldLabel><Input id="new-issue-title" autoFocus value={draft.title} onChange={(event) => update('title', event.target.value)} placeholder="What needs to be done?" maxLength={180}/></div><div><FieldLabel htmlFor="new-issue-description">Description</FieldLabel><Textarea id="new-issue-description" value={draft.description} onChange={(event) => update('description', event.target.value)} placeholder="Add context, acceptance criteria, and useful links…" rows={5}/></div><div className="grid gap-4 sm:grid-cols-2">{metadataFields(draft, update)}</div><div><FieldLabel htmlFor="new-issue-labels">Labels</FieldLabel><Input id="new-issue-labels" value={draft.labels.join(', ')} onChange={(event) => update('labels', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} placeholder="frontend, design"/><p className="mt-1 text-[10px] text-muted-foreground">Separate labels with commas.</p></div></div></div></div>
          : <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_290px] lg:overflow-hidden"><section className="min-w-0 p-4 sm:p-6 lg:overflow-y-auto"><div className="mb-4 flex flex-wrap items-center gap-2"><IssueTypeMark type={draft.type}/><span className="text-xs font-semibold text-muted-foreground">{issue.id}</span><span className="text-border">·</span><Badge>{draft.type}</Badge>{draft.labels.map((label) => <Badge key={label} className="border-transparent bg-primary/10 text-primary">{label}</Badge>)}</div>{editing ? <div className="space-y-4"><div><FieldLabel htmlFor="edit-issue-title" required>Summary</FieldLabel><Input id="edit-issue-title" value={draft.title} onChange={(event) => update('title', event.target.value)} maxLength={180}/></div><div><FieldLabel htmlFor="edit-issue-description">Description</FieldLabel><Textarea id="edit-issue-description" value={draft.description} onChange={(event) => update('description', event.target.value)} rows={5}/></div><div><FieldLabel htmlFor="edit-issue-labels">Labels <span className="font-normal text-muted-foreground">(comma separated)</span></FieldLabel><Input id="edit-issue-labels" value={draft.labels.join(', ')} onChange={(event) => update('labels', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))}/></div></div> : <><h1 className="text-xl font-semibold leading-7 tracking-tight text-foreground sm:text-2xl">{draft.title}</h1><div className="mt-5"><h2 className="mb-2 text-xs font-semibold">Description</h2><p className="whitespace-pre-wrap text-xs leading-6 text-foreground/85">{draft.description || <span className="italic text-muted-foreground">No description provided.</span>}</p></div>{draft.labels.length > 0 && <div className="mt-5 flex flex-wrap gap-1.5">{draft.labels.map((label) => <Badge key={label} className="border-transparent bg-muted text-muted-foreground">{label}</Badge>)}</div>}</>}
            <SubtaskList subtasks={issue.subtasks} onAdd={(title) => onAddSubtask(issue.id, title)} onToggle={(subtaskId) => onToggleSubtask(issue.id, subtaskId)} onDelete={(subtaskId) => onDeleteSubtask(issue.id, subtaskId)}/>
            <div className="mt-7 border-b border-border"><div role="tablist" aria-label="Issue timeline" className="flex gap-5"><button role="tab" aria-selected={tab === 'activity'} onClick={() => setTab('activity')} className={`relative h-9 text-xs ${tab === 'activity' ? 'font-semibold text-primary after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 after:bg-primary' : 'text-muted-foreground hover:text-foreground'}`}>Activity</button><button role="tab" aria-selected={tab === 'comments'} onClick={() => setTab('comments')} className={`relative h-9 text-xs ${tab === 'comments' ? 'font-semibold text-primary after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 after:bg-primary' : 'text-muted-foreground hover:text-foreground'}`}>Comments <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-[9px]">{issue.comments.length}</span></button></div></div>
            <div className="pt-2"><IssueActivityFeed issue={issue} mode={tab}/></div><div className="mt-3"><CommentComposer key={issue.id} onSubmit={(body) => onAddComment(issue.id, body)} onToast={onToast}/></div>
          </section>
          <aside className="border-t border-border bg-muted/20 p-4 sm:p-5 lg:border-l lg:border-t-0 lg:overflow-y-auto"><div className="mb-3 flex items-center justify-between"><h2 className="text-xs font-semibold">Details</h2><Button variant="ghost" size="xs" className="text-muted-foreground" onClick={() => { if (editing && issue) { setDraft(draftFromIssue(issue)); setEditing(false) } else setEditing(true) }}>{editing ? 'Discard' : 'Edit'}</Button></div>{editing ? <div className="space-y-3">{metadataFields(draft, update)}</div> : <div className="space-y-4">{detailRow('Status', <StatusBadge status={draft.status} label={statusMeta[draft.status].label}/>)}{detailRow('Priority', <div className="flex items-center gap-2 text-xs"><PriorityMark priority={draft.priority}/>{draft.priority}</div>)}{detailRow('Assignee', <div className="flex items-center gap-2 text-xs"><Avatar name={draft.assignee} size="sm"/>{draft.assignee}</div>)}{detailRow('Issue type', <div className="flex items-center gap-2 text-xs"><IssueTypeMark type={draft.type}/>{draft.type}</div>)}{detailRow('Story points', <span className="text-xs">{draft.points} pts</span>)}{draft.due && detailRow('Due date', <span className="flex items-center gap-1.5 text-xs"><CalendarDays size={13}/>{draft.due}</span>)}</div>}
            <div className="mt-6 border-t border-border pt-4"><h3 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">People</h3><div className="flex items-center justify-between"><span className="text-[11px] text-muted-foreground">Assignee</span><div className="flex items-center gap-1.5"><Avatar name={draft.assignee} size="sm"/><span className="max-w-24 truncate text-[10px]">{draft.assignee}</span></div></div><div className="mt-3 flex items-center justify-between"><span className="text-[11px] text-muted-foreground">Reporter</span><div className="flex items-center gap-1.5"><Avatar name="Olivia Chen" size="sm"/><span className="text-[10px]">Olivia Chen</span></div></div><div className="mt-3 flex items-center justify-between"><span className="text-[11px] text-muted-foreground">Watching</span><span className="flex items-center gap-1">{issue.watchers.slice(0, 3).map((watcher) => <Avatar key={watcher} name={watcher} size="xs"/>)}<span className="ml-1 text-[10px] text-muted-foreground">{issue.watchers.length || 'No one yet'}</span></span></div></div>
            <div className="mt-6 border-t border-border pt-4"><h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Dates</h3><p className="text-[10px] text-muted-foreground">Created {createdAt ? formatDate(createdAt) : '—'}</p><p className="mt-1 text-[10px] text-muted-foreground">Updated {updatedAt ? formatDate(updatedAt) : '—'}</p></div>
          </aside></div>}

        <div className="flex min-h-14 items-center justify-between border-t border-border bg-muted/20 px-4 sm:px-5"><span className="hidden text-[10px] text-muted-foreground sm:inline">Changes are saved in this browser</span><div className="ml-auto flex gap-2"><Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>{issue ? 'Close' : 'Cancel'}</Button>{(!issue || editing) && <Button size="sm" onClick={save} disabled={!draft.title.trim()}>{issue ? 'Save changes' : 'Create issue'}</Button>}</div></div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
}

function detailRow(label: string, value: ReactNode) {
  return <div className="flex min-h-8 items-center justify-between gap-3"><span className="text-[11px] text-muted-foreground">{label}</span><div className="min-w-0">{value}</div></div>
}

function metadataFields(draft: IssueDraft, update: <K extends keyof IssueDraft>(key: K, value: IssueDraft[K]) => void) {
  return <><div><FieldLabel htmlFor="issue-status-field">Status</FieldLabel><Select id="issue-status-field" value={draft.status} onChange={(event) => update('status', event.target.value as IssueStatus)}>{statuses.map((status) => <option key={status} value={status}>{statusMeta[status].label}</option>)}</Select></div><div><FieldLabel htmlFor="issue-priority-field">Priority</FieldLabel><Select id="issue-priority-field" value={draft.priority} onChange={(event) => update('priority', event.target.value as IssuePriority)}>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</Select></div><div><FieldLabel htmlFor="issue-assignee-field">Assignee</FieldLabel><Select id="issue-assignee-field" value={draft.assignee} onChange={(event) => update('assignee', event.target.value)}>{people.map((person) => <option key={person.name}>{person.name}</option>)}</Select></div><div><FieldLabel htmlFor="issue-type-field">Issue type</FieldLabel><Select id="issue-type-field" value={draft.type} onChange={(event) => update('type', event.target.value as IssueType)}>{types.map((type) => <option key={type}>{type}</option>)}</Select></div><div><FieldLabel htmlFor="issue-points-field">Story points</FieldLabel><Input id="issue-points-field" type="number" min={0} max={100} value={draft.points} onChange={(event) => update('points', Number(event.target.value))}/></div><div><FieldLabel htmlFor="issue-due-field">Due date</FieldLabel><Input id="issue-due-field" type="date" value={draft.due ?? ''} onChange={(event) => update('due', event.target.value)}/></div></>
}

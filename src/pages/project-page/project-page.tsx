import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Activity, BookOpen, CalendarDays, Grid2X2, History, List, MoreHorizontal, Plus, Settings2, UserRound, UserRoundPlus } from 'lucide-react'
import { initialIssues, people, statusMeta } from '@/data'
import type { Issue, IssuePriority, IssueStatus, View } from '@/types/domain'
import type { ProjectPageProps } from '@/types/components/pages/project-page'
import { Button } from '@/components/atoms/button'
import { Select } from '@/components/atoms/form-field'
import { AvatarStack } from '@/components/molecules/avatar-stack'
import { SearchField } from '@/components/molecules/search-field'
import { SprintSummary } from '@/components/molecules/sprint-summary'
import { WorkspaceLayout } from '@/components/templates/workspace-layout'
import { IssueBoard } from '@/components/organisms/issue-board'
import { IssueDialog } from '@/components/organisms/issue-dialog'
import { IssueList } from '@/components/organisms/issue-list'
import { BacklogView } from '@/components/organisms/backlog-view'
import { MyWorkView } from '@/components/organisms/my-work-view'
import { ActivityView } from '@/components/organisms/activity-view'
import { CalendarView } from '@/components/organisms/calendar-view'
import { cn } from '@/lib/utils'
import { createId } from '@/lib/id'

const ReportsView = lazy(() => import('@/components/organisms/reports-view').then((module) => ({ default: module.ReportsView })))
const priorities: IssuePriority[] = ['Highest', 'High', 'Medium', 'Low']

function loadIssues(): Issue[] {
  try {
    const raw = localStorage.getItem('sprintforge-issues-v1')
    if (!raw) return initialIssues
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return initialIssues
    return parsed.map((item: Partial<Issue> & { comments?: unknown }) => {
      const seed = initialIssues.find((issue) => issue.id === item.id)
      const comments = Array.isArray(item.comments) ? item.comments as Issue['comments'] : seed?.comments ?? []
      const activity = Array.isArray(item.activity) ? item.activity as Issue['activity'] : seed?.activity ?? []
      const watchers = Array.isArray(item.watchers) ? item.watchers as Issue['watchers'] : seed?.watchers ?? []
      const subtasks = Array.isArray(item.subtasks) ? item.subtasks as Issue['subtasks'] : seed?.subtasks ?? []
      return { ...seed, ...item, comments, activity, watchers, subtasks } as Issue
    })
  } catch { return initialIssues }
}
const tabs: { id: View; label: string; Icon: typeof Grid2X2 }[] = [
  { id: 'board', label: 'Board', Icon: Grid2X2 },
  { id: 'list', label: 'List', Icon: List },
  { id: 'backlog', label: 'Backlog', Icon: BookOpen },
  { id: 'reports', label: 'Reports', Icon: Activity },
  { id: 'my-work', label: 'My work', Icon: UserRound },
  { id: 'activity', label: 'Activity', Icon: History },
  { id: 'calendar', label: 'Calendar', Icon: CalendarDays },
]

export function ProjectPage({ theme, onToggleTheme, onToast }: ProjectPageProps) {
  const searchRef = useRef<HTMLInputElement>(null)
  const [view, setView] = useState<View>('board')
  const [query, setQuery] = useState('')
  const [assignee, setAssignee] = useState('all')
  const [priority, setPriority] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [issues, setIssues] = useState<Issue[]>(loadIssues)
  const nextIssueNumber = useRef<number | null>(null)
  const selectedIssue = useMemo(() => issues.find((issue) => issue.id === selectedId) ?? null, [issues, selectedId])
  const filteredIssues = useMemo(() => issues.filter((issue) => {
    const searchable = `${issue.id} ${issue.title} ${issue.labels.join(' ')} ${issue.assignee}`.toLowerCase()
    return searchable.includes(query.trim().toLowerCase()) && (assignee === 'all' || issue.assignee === assignee) && (priority === 'all' || issue.priority === priority)
  }), [issues, query, assignee, priority])

  useEffect(() => { localStorage.setItem('sprintforge-issues-v1', JSON.stringify(issues)) }, [issues])
  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); searchRef.current?.focus() }
      if (event.key === 'Escape') { setDialogOpen(false); setSelectedId(null) }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  const handleOpenIssue = useCallback((id: string) => { setSelectedId(id); setDialogOpen(true) }, [])
  const handleCloseDialog = useCallback((open: boolean) => { setDialogOpen(open); if (!open) setSelectedId(null) }, [])
  const handleMove = useCallback((id: string, status: IssueStatus) => {
    const createdAt = new Date().toISOString()
    const activityId = createId('activity')
    setIssues((current) => current.map((issue) => {
      if (issue.id !== id || issue.status === status) return issue
      return { ...issue, status, activity: [...issue.activity, { id: activityId, actor: 'Olivia Chen', action: `moved this issue from ${statusMeta[issue.status].label} to ${statusMeta[status].label}`, createdAt }] }
    }))
  }, [])
  const handleSort = useCallback(() => { setIssues((current) => [...current].reverse()) }, [])

  const handleSave = useCallback((data: Omit<Issue, 'id' | 'comments' | 'activity' | 'watchers' | 'subtasks'>, id?: string) => {
    const createdAt = new Date().toISOString()
    if (id) {
      const activityId = createId('activity')
      setIssues((current) => current.map((issue) => issue.id === id ? { ...issue, ...data, activity: [...issue.activity, { id: activityId, actor: 'Olivia Chen', action: 'updated issue details', createdAt }] } : issue))
      onToast(`${id} updated`)
    } else {
      if (nextIssueNumber.current === null) nextIssueNumber.current = Math.max(150, ...issues.map((issue) => Number(issue.id.split('-')[1]) || 0)) + 1
      const newIssue: Issue = { ...data, id: `NOVA-${nextIssueNumber.current}`, comments: [], watchers: [], subtasks: [], activity: [{ id: createId('created'), actor: 'Olivia Chen', action: 'created this issue', createdAt }] }
      nextIssueNumber.current += 1
      setIssues((current) => [newIssue, ...current])
      onToast(`${newIssue.id} created`)
    }
    setDialogOpen(false)
    setSelectedId(null)
  }, [issues, onToast])

  const handleAddComment = useCallback((issueId: string, body: string) => {
    const createdAt = new Date().toISOString()
    const id = createId('comment')
    const entry = { id, author: 'Olivia Chen', body: body.trim(), createdAt }
    setIssues((current) => current.map((issue) => issue.id === issueId ? {
      ...issue,
      comments: [...issue.comments, entry],
      activity: [...issue.activity, { id: `activity-${id}`, actor: entry.author, action: 'commented', createdAt, commentId: id }],
    } : issue))
    onToast('Comment added')
  }, [onToast])

  const handleToggleWatch = useCallback((issueId: string) => {
    const watching = !selectedIssue?.watchers.includes('Olivia Chen')
    const createdAt = new Date().toISOString()
    const activityId = createId('activity')
    setIssues((current) => current.map((issue) => {
      if (issue.id !== issueId) return issue
      const shouldWatch = !issue.watchers.includes('Olivia Chen')
      const watchers = shouldWatch ? [...issue.watchers, 'Olivia Chen'] : issue.watchers.filter((name) => name !== 'Olivia Chen')
      return { ...issue, watchers, activity: [...issue.activity, { id: activityId, actor: 'Olivia Chen', action: shouldWatch ? 'started watching this issue' : 'stopped watching this issue', createdAt }] }
    }))
    onToast(watching ? 'You are now watching this issue' : 'You stopped watching this issue')
  }, [onToast, selectedIssue])

  const handleAddSubtask = useCallback((issueId: string, title: string) => {
    const createdAt = new Date().toISOString()
    const subtask = { id: createId('subtask'), title, done: false, assignee: 'Olivia Chen' }
    setIssues((current) => current.map((issue) => issue.id === issueId ? { ...issue, subtasks: [...issue.subtasks, subtask], activity: [...issue.activity, { id: createId('activity'), actor: 'Olivia Chen', action: `added subtask “${title}”`, createdAt }] } : issue))
    onToast('Subtask added')
  }, [onToast])

  const handleToggleSubtask = useCallback((issueId: string, subtaskId: string) => {
    const createdAt = new Date().toISOString()
    const activityId = createId('activity')
    setIssues((current) => current.map((issue) => {
      if (issue.id !== issueId) return issue
      const subtask = issue.subtasks.find((item) => item.id === subtaskId)
      if (!subtask) return issue
      const done = !subtask.done
      return { ...issue, subtasks: issue.subtasks.map((item) => item.id === subtaskId ? { ...item, done } : item), activity: [...issue.activity, { id: activityId, actor: 'Olivia Chen', action: `${done ? 'completed' : 'reopened'} subtask “${subtask.title}”`, createdAt }] }
    }))
  }, [])

  const handleDeleteSubtask = useCallback((issueId: string, subtaskId: string) => {
    const createdAt = new Date().toISOString()
    const activityId = createId('activity')
    setIssues((current) => current.map((issue) => {
      if (issue.id !== issueId) return issue
      const subtask = issue.subtasks.find((item) => item.id === subtaskId)
      if (!subtask) return issue
      return { ...issue, subtasks: issue.subtasks.filter((item) => item.id !== subtaskId), activity: [...issue.activity, { id: activityId, actor: 'Olivia Chen', action: `removed subtask “${subtask.title}”`, createdAt }] }
    }))
    onToast('Subtask deleted')
  }, [onToast])

  const resetDemo = useCallback(() => { setIssues(initialIssues); localStorage.removeItem('sprintforge-issues-v1'); onToast('Demo data restored') }, [onToast])
  const openCreate = useCallback(() => { setSelectedId(null); setDialogOpen(true) }, [])

  return <WorkspaceLayout view={view} theme={theme} onNavigate={setView} onToggleTheme={onToggleTheme} onToast={onToast}>
    <div className="flex flex-wrap items-start justify-between gap-4"><div className="flex min-w-0 items-center gap-3"><div className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-indigo-400 text-lg font-extrabold text-white shadow-md shadow-primary/20">N</div><div className="min-w-0"><p className="mb-1 text-[9px] font-bold tracking-[.15em] text-muted-foreground">PRODUCT DEVELOPMENT <span className="px-1">·</span> NOVA</p><h1 className="truncate font-[family-name:var(--font-display)] text-xl font-bold tracking-tight sm:text-2xl">Nova mobile app</h1><p className="mt-1 text-xs text-muted-foreground">A calmer way to bring your team’s best ideas to life.</p></div></div><div className="flex items-center gap-2"><AvatarStack names={people.slice(0, 4).map((person) => person.name)} onInvite={() => onToast('Invite flow is coming next')}/><Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={() => onToast('Sharing is a demo-only placeholder for the future API')}><UserRoundPlus size={14}/>Share</Button><Button variant="ghost" size="icon" aria-label="Restore sample data" title="Restore sample data" onClick={resetDemo}><MoreHorizontal size={18}/></Button></div></div>
    <div className="mt-6 flex items-center gap-4 overflow-x-auto border-b border-border">{tabs.map(({ id, label, Icon }) => <button key={id} role="tab" aria-selected={view === id} onClick={() => setView(id)} className={cn('relative flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground transition hover:text-foreground', view === id && 'font-semibold text-primary after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 after:rounded-full after:bg-primary')}><Icon size={14}/>{label}{id === 'board' && <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">{issues.length}</span>}</button>)}<Button variant="ghost" size="icon" className="size-7" aria-label="Add view" onClick={() => onToast('Custom views are coming next')}><Plus size={15}/></Button><div className="ml-auto hidden items-center gap-3 pb-2 sm:flex"><span className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="size-1.5 rounded-full bg-emerald-500"/>All changes saved</span><Button variant="ghost" size="sm" className="h-7 text-[10px] text-muted-foreground" onClick={() => onToast('View settings are coming next')}><Settings2 size={13}/>View settings</Button></div></div>
    {view === 'board' && <><div className="mt-4"><SprintSummary issues={issues} onMore={() => onToast('Sprint actions are coming next')}/></div><div className="my-4 flex flex-wrap items-center justify-between gap-2"><div className="flex min-w-0 flex-1 flex-wrap items-center gap-2"><SearchField inputRef={searchRef} value={query} onChange={setQuery}/><Select value={assignee} onChange={(event) => setAssignee(event.target.value)} aria-label="Filter by assignee" className="w-auto min-w-32 text-xs"><option value="all">All assignees</option>{people.map((person) => <option key={person.name}>{person.name}</option>)}</Select><Select value={priority} onChange={(event) => setPriority(event.target.value)} aria-label="Filter by priority" className="w-auto min-w-32 text-xs"><option value="all">All priorities</option>{priorities.map((item) => <option key={item}>{item}</option>)}</Select><Button variant="ghost" size="sm" className="h-9 px-2 text-xs text-muted-foreground" onClick={() => { setAssignee('all'); setPriority('all'); setQuery('') }}>Clear</Button></div><div className="flex items-center gap-1.5"><Button variant="outline" size="icon" className="size-9" aria-label="Sort issues" onClick={handleSort}><List size={15}/></Button><Button variant="outline" size="sm" className="hidden h-9 sm:inline-flex" onClick={() => onToast('Automation rules are coming next')}><Activity size={14}/>Automate</Button><Button size="sm" className="h-9" onClick={openCreate}><Plus size={15}/>Create issue</Button></div></div><IssueBoard issues={filteredIssues} onOpen={handleOpenIssue} onMove={handleMove} onCreate={openCreate} onToast={onToast}/></>}
    {view === 'list' && <div className="mt-5"><div className="mb-3 flex flex-wrap items-center gap-2"><SearchField inputRef={searchRef} value={query} onChange={setQuery}/><Select value={assignee} onChange={(event) => setAssignee(event.target.value)} aria-label="Filter by assignee" className="w-auto min-w-32 text-xs"><option value="all">All assignees</option>{people.map((person) => <option key={person.name}>{person.name}</option>)}</Select><Button size="sm" onClick={openCreate}><Plus size={14}/>Create issue</Button></div><IssueList issues={filteredIssues} onOpen={handleOpenIssue} onSort={handleSort}/></div>}
    {view === 'backlog' && <div className="mt-5"><BacklogView issues={filteredIssues} onOpen={handleOpenIssue} onCreate={openCreate} onToast={onToast}/></div>}
    {view === 'reports' && <div className="mt-5"><Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-muted"/>}><ReportsView issues={issues} onToast={onToast}/></Suspense></div>}
    {view === 'my-work' && <div className="mt-5"><MyWorkView issues={issues} onOpen={handleOpenIssue}/></div>}
    {view === 'activity' && <div className="mt-5"><ActivityView issues={issues} onOpen={handleOpenIssue}/></div>}
    {view === 'calendar' && <div className="mt-5"><CalendarView issues={issues} onOpen={handleOpenIssue}/></div>}
    <footer className="mt-7 flex items-center justify-between text-[10px] text-muted-foreground"><span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-500"/>SprintForge demo workspace</span><span className="hidden items-center gap-1 sm:flex">Made for teams who make things happen <span className="text-violet-400">✦</span></span></footer>
    <IssueDialog open={dialogOpen} issue={selectedIssue} onOpenChange={handleCloseDialog} onSave={handleSave} onAddComment={handleAddComment} onToggleWatch={handleToggleWatch} onAddSubtask={handleAddSubtask} onToggleSubtask={handleToggleSubtask} onDeleteSubtask={handleDeleteSubtask} onToast={onToast}/>
  </WorkspaceLayout>
}

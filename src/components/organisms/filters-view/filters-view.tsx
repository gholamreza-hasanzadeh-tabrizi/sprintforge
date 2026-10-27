import { useEffect, useMemo, useState } from 'react'
import { Bookmark, Filter, Plus, Trash2 } from 'lucide-react'
import type { IssuePriority, IssueStatus, SavedIssueFilter } from '@/types/domain'
import type { FiltersSubmitEvent, FiltersViewProps } from '@/types/components/organisms/filters-view'
import { people, statusMeta } from '@/data'
import { Input, Select } from '@/components/atoms/form-field'
import { Button } from '@/components/atoms/button'
import { PriorityMark } from '@/components/atoms/issue-markers'
import { createId } from '@/lib/id'

const storageKey = 'sprintforge-saved-filters-v1'
const statusOptions: { value: IssueStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Any status' },
  { value: 'todo', label: 'To do' },
  { value: 'progress', label: 'In progress' },
  { value: 'review', label: 'In review' },
  { value: 'done', label: 'Done' },
]
const priorityOptions: { value: IssuePriority | 'all'; label: string }[] = [
  { value: 'all', label: 'Any priority' },
  { value: 'Highest', label: 'Highest' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
]
const presets: SavedIssueFilter[] = [
  { id: 'preset-my-open', name: 'My open issues', status: 'all', priority: 'all', assignee: 'Olivia Chen', query: '', openOnly: true },
  { id: 'preset-high-priority', name: 'High priority', status: 'all', priority: 'High', assignee: 'all', query: '' },
  { id: 'preset-review', name: 'Needs review', status: 'review', priority: 'all', assignee: 'all', query: '' },
  { id: 'preset-due-soon', name: 'Due in 7 days', status: 'all', priority: 'all', assignee: 'all', query: '', dueWithinDays: 7, openOnly: true },
]

function loadSavedFilters(): SavedIssueFilter[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is SavedIssueFilter => !!item && typeof item.id === 'string' && typeof item.name === 'string' && typeof item.status === 'string' && typeof item.priority === 'string' && typeof item.assignee === 'string' && typeof item.query === 'string')
  } catch { return [] }
}

function todayKey() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function matchesFilter(issue: FiltersViewProps['issues'][number], filter: SavedIssueFilter) {
  if (filter.status !== 'all' && issue.status !== filter.status) return false
  if (filter.priority !== 'all' && issue.priority !== filter.priority) return false
  if (filter.assignee !== 'all' && issue.assignee !== filter.assignee) return false
  if (filter.openOnly && issue.status === 'done') return false
  if (filter.query && !`${issue.id} ${issue.title} ${issue.labels.join(' ')}`.toLowerCase().includes(filter.query.toLowerCase())) return false
  if (filter.dueWithinDays) {
    if (!issue.due) return false
    const dueLimit = new Date(`${todayKey()}T00:00:00`)
    dueLimit.setDate(dueLimit.getDate() + filter.dueWithinDays)
    if (issue.due < todayKey() || issue.due > `${dueLimit.getFullYear()}-${String(dueLimit.getMonth() + 1).padStart(2, '0')}-${String(dueLimit.getDate()).padStart(2, '0')}`) return false
  }
  return true
}

export function FiltersView({ issues, onOpen }: FiltersViewProps) {
  const [savedFilters, setSavedFilters] = useState<SavedIssueFilter[]>(loadSavedFilters)
  const [activeId, setActiveId] = useState(presets[0].id)
  const [name, setName] = useState('')
  const [status, setStatus] = useState<IssueStatus | 'all'>('all')
  const [priority, setPriority] = useState<IssuePriority | 'all'>('all')
  const [assignee, setAssignee] = useState('all')
  const filters = useMemo(() => [...presets, ...savedFilters], [savedFilters])
  const activeFilter = filters.find((item) => item.id === activeId) ?? presets[0]
  const results = useMemo(() => issues.filter((issue) => matchesFilter(issue, activeFilter)), [issues, activeFilter])

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(savedFilters)) }, [savedFilters])

  function saveFilter(event: FiltersSubmitEvent) {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return
    const next: SavedIssueFilter = { id: createId('filter'), name: trimmedName, status, priority, assignee, query: '' }
    setSavedFilters((current) => [...current, next])
    setActiveId(next.id)
    setName('')
  }

  function removeFilter(id: string) {
    setSavedFilters((current) => current.filter((filter) => filter.id !== id))
    if (activeId === id) setActiveId(presets[0].id)
  }

  return <div className="space-y-5">
    <div><h2 className="font-[family-name:var(--font-display)] text-lg font-bold">Saved filters</h2><p className="mt-1 text-xs text-muted-foreground">Create reusable issue searches and keep them in this browser.</p></div>
    <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <section className="rounded-xl border border-border bg-card p-4"><h3 className="mb-3 flex items-center gap-2 text-xs font-semibold"><Bookmark size={14} className="text-primary"/>Quick filters</h3><div className="space-y-1">{presets.map((filter) => <button key={filter.id} onClick={() => setActiveId(filter.id)} className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition hover:bg-muted ${activeId === filter.id ? 'bg-primary/10 font-semibold text-primary' : 'text-foreground'}`}>{filter.name}<span className="text-[10px] text-muted-foreground">{issues.filter((issue) => matchesFilter(issue, filter)).length}</span></button>)}</div>
          {savedFilters.length > 0 && <><p className="mb-1 mt-4 border-t border-border pt-3 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Your filters</p><div className="space-y-1">{savedFilters.map((filter) => <div key={filter.id} className={`flex items-center gap-1 rounded-md ${activeId === filter.id ? 'bg-primary/10' : 'hover:bg-muted'}`}><button onClick={() => setActiveId(filter.id)} className="min-w-0 flex-1 truncate px-3 py-2 text-left text-xs font-medium">{filter.name}</button><button onClick={() => removeFilter(filter.id)} aria-label={`Delete ${filter.name}`} className="mr-1 rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 size={13}/></button></div>)}</div></>}
        </section>
        <form onSubmit={saveFilter} className="space-y-3 rounded-xl border border-border bg-card p-4"><h3 className="flex items-center gap-2 text-xs font-semibold"><Plus size={14} className="text-primary"/>Create a filter</h3><div><label htmlFor="saved-filter-name" className="mb-1 block text-[10px] font-medium text-muted-foreground">Filter name</label><Input id="saved-filter-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Aisha’s high-priority work" maxLength={48} required/></div><div><label htmlFor="saved-filter-status" className="mb-1 block text-[10px] font-medium text-muted-foreground">Status</label><Select id="saved-filter-status" value={status} onChange={(event) => setStatus(event.target.value as IssueStatus | 'all')}>{statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></div><div><label htmlFor="saved-filter-priority" className="mb-1 block text-[10px] font-medium text-muted-foreground">Priority</label><Select id="saved-filter-priority" value={priority} onChange={(event) => setPriority(event.target.value as IssuePriority | 'all')}>{priorityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></div><div><label htmlFor="saved-filter-assignee" className="mb-1 block text-[10px] font-medium text-muted-foreground">Assignee</label><Select id="saved-filter-assignee" value={assignee} onChange={(event) => setAssignee(event.target.value)}><option value="all">Anyone</option>{people.map((person) => <option key={person.name} value={person.name}>{person.name}</option>)}</Select></div><Button type="submit" size="sm" className="w-full" disabled={!name.trim()}><Plus size={14}/>Save filter</Button></form>
      </aside>
      <section className="overflow-hidden rounded-xl border border-border bg-card"><header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3"><div><h3 className="text-xs font-semibold">{activeFilter.name}</h3><p className="mt-1 text-[10px] text-muted-foreground">{results.length} matching issue{results.length === 1 ? '' : 's'}</p></div><Filter size={15} className="text-primary"/></header>{results.length ? <div className="divide-y divide-border/70">{results.map((issue) => <button key={issue.id} onClick={() => onOpen(issue.id)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-muted/40"><span className="w-20 shrink-0 text-[10px] font-medium text-muted-foreground">{issue.id}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium text-foreground">{issue.title}</span><span className="mt-1 block text-[10px] text-muted-foreground">{statusMeta[issue.status].label} · {issue.assignee}</span></span><PriorityMark priority={issue.priority}/><span className="hidden text-[10px] text-muted-foreground sm:block">{issue.priority}</span></button>)}</div> : <div className="grid min-h-48 place-items-center p-6 text-center"><div><p className="text-xs font-semibold">No issues match this filter</p><p className="mt-1 text-[11px] text-muted-foreground">Try a different preset or adjust your filter criteria.</p></div></div>}</section>
    </div>
  </div>
}

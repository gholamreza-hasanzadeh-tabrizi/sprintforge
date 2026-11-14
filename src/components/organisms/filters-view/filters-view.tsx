import { useMemo, useState } from 'react'
import { Bookmark, Filter, Plus, Trash2 } from 'lucide-react'
import type { IssuePriority, IssueStatus, SavedIssueFilter } from '@/types/domain'
import type { FiltersSubmitEvent, FiltersViewProps } from '@/types/components/organisms/filters-view'
import { people, statusMeta } from '@/data'
import { Input, Select } from '@/components/atoms/form-field'
import { Button } from '@/components/atoms/button'
import { PriorityMark } from '@/components/atoms/issue-markers'
import { createId } from '@/lib/id'

const storageKey = 'sprintforge-saved-filters-v1'
const statusValues: IssueStatus[] = ['todo', 'progress', 'review', 'done']
const priorityValues: IssuePriority[] = ['Highest', 'High', 'Medium', 'Low']

const statusOptions: { value: IssueStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Any status' },
  ...statusValues.map((status) => ({ value: status, label: statusMeta[status].label })),
]
const priorityOptions: { value: IssuePriority | 'all'; label: string }[] = [
  { value: 'all', label: 'Any priority' },
  ...priorityValues.map((priority) => ({ value: priority, label: priority })),
]

const presets: SavedIssueFilter[] = [
  { id: 'preset-my-open', name: 'My open issues', status: 'all', priority: 'all', assignee: 'Olivia Chen', query: '', openOnly: true },
  { id: 'preset-high-priority', name: 'High priority', status: 'all', priority: 'all', priorityIn: ['Highest', 'High'], assignee: 'all', query: '', openOnly: true },
  { id: 'preset-review', name: 'Needs review', status: 'review', priority: 'all', assignee: 'all', query: '' },
  { id: 'preset-due-soon', name: 'Due in 7 days', status: 'all', priority: 'all', assignee: 'all', query: '', dueWithinDays: 7, openOnly: true },
]

function isStoredFilter(value: unknown): value is SavedIssueFilter {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  const statusOk = item.status === 'all' || (typeof item.status === 'string' && (statusValues as string[]).includes(item.status))
  const priorityOk = item.priority === 'all' || (typeof item.priority === 'string' && (priorityValues as string[]).includes(item.priority))
  const priorityInOk = item.priorityIn === undefined || (Array.isArray(item.priorityIn) && item.priorityIn.every((priority) => typeof priority === 'string' && (priorityValues as string[]).includes(priority)))
  return typeof item.id === 'string'
    && typeof item.name === 'string'
    && statusOk
    && priorityOk
    && priorityInOk
    && typeof item.assignee === 'string'
    && typeof item.query === 'string'
    && (item.openOnly === undefined || typeof item.openOnly === 'boolean')
    && (item.dueWithinDays === undefined || (typeof item.dueWithinDays === 'number' && Number.isFinite(item.dueWithinDays)))
}

function loadSavedFilters(): SavedIssueFilter[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isStoredFilter)
  } catch { return [] }
}

// Storage writes are best-effort: a blocked or full localStorage must never break the view.
function persistFilters(filters: SavedIssueFilter[]) {
  try { localStorage.setItem(storageKey, JSON.stringify(filters)) } catch { /* ignore */ }
}

function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function matchesFilter(issue: FiltersViewProps['issues'][number], filter: SavedIssueFilter) {
  if (filter.status !== 'all' && issue.status !== filter.status) return false
  if (filter.priority !== 'all' && issue.priority !== filter.priority) return false
  if (filter.priorityIn?.length && !filter.priorityIn.includes(issue.priority)) return false
  if (filter.assignee !== 'all' && issue.assignee !== filter.assignee) return false
  if (filter.openOnly && issue.status === 'done') return false
  if (filter.query && !`${issue.id} ${issue.title} ${issue.labels.join(' ')}`.toLowerCase().includes(filter.query.toLowerCase())) return false
  if (filter.dueWithinDays) {
    if (!issue.due) return false
    const limit = new Date(`${localDateKey()}T00:00:00`)
    limit.setDate(limit.getDate() + filter.dueWithinDays)
    if (issue.due < localDateKey() || issue.due > localDateKey(limit)) return false
  }
  return true
}

export function FiltersView({ issues, onOpen }: FiltersViewProps) {
  const [savedFilters, setSavedFilters] = useState<SavedIssueFilter[]>(loadSavedFilters)
  const [activeId, setActiveId] = useState(presets[0].id)
  const [name, setName] = useState('')
  const [queryText, setQueryText] = useState('')
  const [status, setStatus] = useState<IssueStatus | 'all'>('all')
  const [priority, setPriority] = useState<IssuePriority | 'all'>('all')
  const [assignee, setAssignee] = useState('all')

  const filters = useMemo(() => [...presets, ...savedFilters], [savedFilters])
  const activeFilter = filters.find((item) => item.id === activeId) ?? presets[0]
  const results = useMemo(() => issues.filter((issue) => matchesFilter(issue, activeFilter)), [issues, activeFilter])
  const trimmedName = name.trim()
  const duplicateName = trimmedName !== '' && savedFilters.some((filter) => filter.name.toLowerCase() === trimmedName.toLowerCase())
  const canSave = trimmedName !== '' && !duplicateName

  function saveFilter(event: FiltersSubmitEvent) {
    event.preventDefault()
    if (!canSave) return
    const next: SavedIssueFilter = { id: createId('filter'), name: trimmedName, status, priority, assignee, query: queryText.trim() }
    const updated = [...savedFilters, next]
    setSavedFilters(updated)
    persistFilters(updated)
    setActiveId(next.id)
    setName('')
    setQueryText('')
  }

  function removeFilter(id: string) {
    const updated = savedFilters.filter((filter) => filter.id !== id)
    setSavedFilters(updated)
    persistFilters(updated)
    if (activeId === id) setActiveId(presets[0].id)
  }

  return <div className="space-y-5">
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-lg font-bold">Saved filters</h2>
      <p className="mt-1 text-xs text-muted-foreground">Create reusable issue searches and keep them in this browser.</p>
    </div>
    <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <section className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold"><Bookmark size={14} className="text-primary"/>Quick filters</h3>
          <div className="space-y-1">
            {presets.map((filter) => <button
              key={filter.id}
              type="button"
              aria-pressed={activeId === filter.id}
              onClick={() => setActiveId(filter.id)}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition hover:bg-muted ${activeId === filter.id ? 'bg-primary/10 font-semibold text-primary' : 'text-foreground'}`}
            >
              {filter.name}
              <span className="text-[10px] text-muted-foreground">{issues.filter((issue) => matchesFilter(issue, filter)).length}</span>
            </button>)}
          </div>
          {savedFilters.length > 0 && <>
            <p className="mb-1 mt-4 border-t border-border pt-3 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Your filters</p>
            <div className="space-y-1">
              {savedFilters.map((filter) => <div key={filter.id} className={`flex items-center gap-1 rounded-md ${activeId === filter.id ? 'bg-primary/10' : 'hover:bg-muted'}`}>
                <button
                  type="button"
                  aria-pressed={activeId === filter.id}
                  onClick={() => setActiveId(filter.id)}
                  className="min-w-0 flex-1 truncate px-3 py-2 text-left text-xs font-medium"
                >{filter.name}</button>
                <button
                  type="button"
                  onClick={() => removeFilter(filter.id)}
                  aria-label={`Delete ${filter.name}`}
                  className="mr-1 rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                ><Trash2 size={13}/></button>
              </div>)}
            </div>
          </>}
        </section>
        <form onSubmit={saveFilter} className="space-y-3 rounded-xl border border-border bg-card p-4">
          <h3 className="flex items-center gap-2 text-xs font-semibold"><Plus size={14} className="text-primary"/>Create a filter</h3>
          <div>
            <label htmlFor="saved-filter-name" className="mb-1 block text-[10px] font-medium text-muted-foreground">Filter name</label>
            <Input
              id="saved-filter-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Aisha’s high-priority work"
              maxLength={48}
              required
              error={duplicateName ? 'A filter with this name already exists.' : undefined}
            />
          </div>
          <div>
            <label htmlFor="saved-filter-query" className="mb-1 block text-[10px] font-medium text-muted-foreground">Search text <span className="font-normal">(optional)</span></label>
            <Input
              id="saved-filter-query"
              value={queryText}
              onChange={(event) => setQueryText(event.target.value)}
              placeholder="Issue ID, title, or label"
              maxLength={80}
            />
          </div>
          <div>
            <label htmlFor="saved-filter-status" className="mb-1 block text-[10px] font-medium text-muted-foreground">Status</label>
            <Select id="saved-filter-status" value={status} onChange={(event) => setStatus(event.target.value as IssueStatus | 'all')}>
              {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </Select>
          </div>
          <div>
            <label htmlFor="saved-filter-priority" className="mb-1 block text-[10px] font-medium text-muted-foreground">Priority</label>
            <Select id="saved-filter-priority" value={priority} onChange={(event) => setPriority(event.target.value as IssuePriority | 'all')}>
              {priorityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </Select>
          </div>
          <div>
            <label htmlFor="saved-filter-assignee" className="mb-1 block text-[10px] font-medium text-muted-foreground">Assignee</label>
            <Select id="saved-filter-assignee" value={assignee} onChange={(event) => setAssignee(event.target.value)}>
              <option value="all">Anyone</option>
              {people.map((person) => <option key={person.name} value={person.name}>{person.name}</option>)}
            </Select>
          </div>
          <Button type="submit" size="sm" className="w-full" disabled={!canSave}><Plus size={14}/>Save filter</Button>
        </form>
      </aside>
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <h3 className="text-xs font-semibold">{activeFilter.name}</h3>
            <p className="mt-1 text-[10px] text-muted-foreground">{results.length} matching issue{results.length === 1 ? '' : 's'}</p>
          </div>
          <Filter size={15} className="text-primary"/>
        </header>
        {results.length
          ? <div className="divide-y divide-border/70">
            {results.map((issue) => <button
              key={issue.id}
              type="button"
              onClick={() => onOpen(issue.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-muted/40"
            >
              <span className="w-20 shrink-0 text-[10px] font-medium text-muted-foreground">{issue.id}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium text-foreground">{issue.title}</span>
                <span className="mt-1 block text-[10px] text-muted-foreground">{statusMeta[issue.status].label} · {issue.assignee}</span>
              </span>
              <PriorityMark priority={issue.priority}/>
              <span className="hidden text-[10px] text-muted-foreground sm:block">{issue.priority}</span>
            </button>)}
          </div>
          : <div className="grid min-h-48 place-items-center p-6 text-center">
            <div>
              <p className="text-xs font-semibold">No issues match this filter</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Try a different preset or adjust your filter criteria.</p>
            </div>
          </div>}
      </section>
    </div>
  </div>
}

import { useState, type FormEvent } from 'react'
import { Check, Plus, Trash2 } from 'lucide-react'
import { Button, IconButton } from '@/components/atoms/button'
import { Input } from '@/components/atoms/form-field'
import type { SubtaskListProps } from '@/types/components/molecules/subtask-list'

export function SubtaskList({ subtasks, onAdd, onToggle, onDelete }: SubtaskListProps) {
  const [title, setTitle] = useState('')
  const [adding, setAdding] = useState(false)
  const completed = subtasks.filter((subtask) => subtask.done).length

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalized = title.trim()
    if (!normalized) return
    onAdd(normalized)
    setTitle('')
    setAdding(false)
  }

  return <section aria-labelledby="subtasks-heading" className="mt-6">
    <div className="mb-2 flex items-center justify-between"><div className="flex items-center gap-2"><h2 id="subtasks-heading" className="text-xs font-semibold">Subtasks</h2><span className="rounded bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">{completed}/{subtasks.length}</span></div><Button variant="ghost" size="xs" icon={<Plus/>} onClick={() => setAdding(true)}>Add subtask</Button></div>
    {subtasks.length > 0 && <div className="divide-y divide-border/70 rounded-lg border border-border/80">{subtasks.map((subtask) => <div key={subtask.id} className="group flex min-h-10 items-center gap-2.5 px-3 py-1.5"><button type="button" aria-label={`${subtask.done ? 'Reopen' : 'Complete'} ${subtask.title}`} aria-pressed={subtask.done} onClick={() => onToggle(subtask.id)} className={`grid size-4 shrink-0 place-items-center rounded border transition ${subtask.done ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-background hover:border-primary'}`}>{subtask.done && <Check size={11}/>}</button><span className={`min-w-0 flex-1 text-xs ${subtask.done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{subtask.title}</span>{subtask.assignee && <span className="hidden max-w-28 truncate text-[10px] text-muted-foreground sm:block">{subtask.assignee}</span>}<IconButton label={`Delete subtask ${subtask.title}`} size="icon-xs" className="opacity-0 group-hover:opacity-100 focus:opacity-100" onClick={() => onDelete(subtask.id)}><Trash2 size={13}/></IconButton></div>)}</div>}
    {subtasks.length === 0 && !adding && <button onClick={() => setAdding(true)} className="w-full rounded-lg border border-dashed border-border px-3 py-4 text-left text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground">No subtasks yet. Add a checklist to break this work into steps.</button>}
    {adding && <form onSubmit={submit} className="mt-2 flex items-center gap-2"><Input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} aria-label="Subtask title" placeholder="Describe a subtask…" maxLength={140}/><Button size="icon-sm" type="submit" disabled={!title.trim()} aria-label="Save subtask"><Plus size={15}/></Button><Button variant="ghost" size="sm" onClick={() => { setAdding(false); setTitle('') }}>Cancel</Button></form>}
  </section>
}

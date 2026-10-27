import { BarChart3, BookOpen, CheckCircle2, ChevronDown, FolderKanban, LayoutGrid, Plus, Settings2 } from 'lucide-react'
import type { AppSidebarProps } from '@/types/components/organisms/app-sidebar'
import { Button } from '@/components/atoms/button'
import { cn } from '@/lib/utils'

export function AppSidebar({ view, onNavigate, onToast }: AppSidebarProps) {
  const nav = [
    { label: 'Overview', icon: LayoutGrid, action: () => onNavigate('reports') },
    { label: 'My work', icon: CheckCircle2, action: () => onToast('Personal work view is coming next') },
    { label: 'Projects', icon: FolderKanban, action: () => onToast('You are viewing the Nova project') },
    { label: 'Filters', icon: Settings2, action: () => onToast('Saved filters are coming next') },
  ]
  return <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-border bg-sidebar px-3 py-4 md:flex">
    <div className="mb-5 flex h-9 items-center gap-2 px-2"><span className="grid size-7 rotate-[-8deg] place-items-center rounded-lg bg-primary text-sm font-extrabold text-primary-foreground shadow-sm">S</span><span className="font-[family-name:var(--font-display)] text-base font-extrabold tracking-tight">sprintforge</span></div>
    <button className="flex h-12 items-center gap-2.5 rounded-lg border border-border bg-card px-2.5 text-left shadow-sm transition hover:bg-muted"><span className="grid size-8 place-items-center rounded-md bg-slate-800 text-xs font-bold text-white">N</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold">Northstar Studio</span><span className="block text-[10px] text-muted-foreground">Free workspace</span></span><ChevronDown size={15} className="text-muted-foreground"/></button>
    <div className="mt-6"><p className="mb-2 px-2 text-[10px] font-semibold tracking-[.12em] text-muted-foreground">WORKSPACE</p>{nav.map((item) => <button key={item.label} onClick={item.action} className="flex h-9 w-full items-center gap-2.5 rounded-md px-2.5 text-left text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"><item.icon size={16}/>{item.label}{item.label === 'My work' && <span className="ml-auto text-[10px]">4</span>}</button>)}</div>
    <div className="mb-1 mt-7 flex items-center justify-between px-2"><p className="text-[10px] font-semibold tracking-[.12em] text-muted-foreground">YOUR PROJECTS</p><button className="rounded p-1 text-muted-foreground hover:bg-muted" onClick={() => onToast('Project creation is coming next')} aria-label="Add project"><Plus size={14}/></button></div>
    <button className="flex h-9 items-center gap-2.5 rounded-md bg-primary/10 px-2.5 text-left text-xs font-medium text-foreground"><span className="grid size-5 place-items-center rounded bg-primary text-[10px] font-bold text-primary-foreground">N</span>Nova mobile app</button>
    <button className="flex h-9 items-center gap-2.5 rounded-md px-2.5 text-left text-xs text-muted-foreground hover:bg-muted"><span className="grid size-5 place-items-center rounded bg-violet-500 text-[10px] font-bold text-white">W</span>Website refresh</button>
    <button className="flex h-9 items-center gap-2.5 rounded-md px-2.5 text-left text-xs text-muted-foreground hover:bg-muted"><span className="grid size-5 place-items-center rounded bg-emerald-600 text-[10px] font-bold text-white">O</span>Operations hub</button>
    <p className="mb-2 mt-7 px-2 text-[10px] font-semibold tracking-[.12em] text-muted-foreground">PLANNING</p>
    <button onClick={() => onNavigate('backlog')} className={cn('flex h-9 items-center gap-2.5 rounded-md px-2.5 text-left text-xs text-muted-foreground hover:bg-muted', view === 'backlog' && 'bg-primary/10 text-primary')}><BookOpen size={16}/>Backlog<span className="ml-auto text-[10px]">7</span></button>
    <button onClick={() => onNavigate('reports')} className={cn('flex h-9 items-center gap-2.5 rounded-md px-2.5 text-left text-xs text-muted-foreground hover:bg-muted', view === 'reports' && 'bg-primary/10 text-primary')}><BarChart3 size={16}/>Reports</button>
    <div className="mt-auto">
      <div className="rounded-lg border border-border bg-card p-3"><div className="mb-2 grid size-7 place-items-center rounded-md bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300"><span className="text-sm">✦</span></div><p className="text-xs font-semibold">Make good work flow.</p><p className="mt-1 text-[10px] text-muted-foreground">Plan clearly. Ship confidently.</p><Button variant="ghost" size="xs" className="mt-2 px-0 text-primary" onClick={() => onToast('Thanks for exploring SprintForge!')}>Explore features <Plus size={12}/></Button></div>
      <button onClick={() => onToast('Workspace settings are coming next')} className="mt-3 flex h-9 w-full items-center gap-2.5 rounded-md px-2 text-xs text-muted-foreground hover:bg-muted"><Settings2 size={16}/>Settings</button>
      <div className="mt-2 flex items-center gap-2.5 border-t border-border px-1 pt-3"><span className="grid size-8 place-items-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-800 dark:bg-violet-950 dark:text-violet-200">OC</span><span className="min-w-0 flex-1"><span className="block text-xs font-semibold">Olivia Chen</span><span className="block truncate text-[10px] text-muted-foreground">olivia@northstar.design</span></span><button className="text-muted-foreground" aria-label="Profile menu"><span>···</span></button></div>
    </div>
  </aside>
}

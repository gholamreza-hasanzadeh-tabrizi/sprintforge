import { useState } from 'react'
import { Database, Moon, Sun } from 'lucide-react'
import type { SettingsViewProps } from '@/types/components/organisms/settings-view'
import { Button } from '@/components/atoms/button'

export function SettingsView({ theme, onToggleTheme, onRestoreSample }: SettingsViewProps) {
  const [confirmingRestore, setConfirmingRestore] = useState(false)

  function restore() {
    setConfirmingRestore(false)
    onRestoreSample()
  }

  return <div className="mx-auto max-w-3xl space-y-5">
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-lg font-bold">Workspace settings</h2>
      <p className="mt-1 text-xs text-muted-foreground">Manage this demo workspace’s appearance and local data.</p>
    </div>
    <section className="rounded-xl border border-border bg-card">
      <div className="flex items-start gap-3 border-b border-border p-4">
        <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">{theme === 'dark' ? <Moon size={17}/> : <Sun size={17}/>}</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-xs font-semibold">Appearance</h3>
          <p className="mt-1 text-[11px] text-muted-foreground">Choose a light or dark interface. Your choice is saved on this device.</p>
        </div>
        <Button variant="outline" size="sm" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>Switch to {theme === 'dark' ? 'light' : 'dark'}</Button>
      </div>
      <div className="px-4 py-3 text-[10px] text-muted-foreground">Current theme: <strong className="font-semibold text-foreground">{theme === 'dark' ? 'Dark' : 'Light'}</strong></div>
    </section>
    <section className="rounded-xl border border-border bg-card">
      <div className="flex items-start gap-3 p-4">
        <span className="grid size-9 place-items-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400"><Database size={17}/></span>
        <div className="min-w-0 flex-1">
          <h3 className="text-xs font-semibold">Demo data</h3>
          <p className="mt-1 text-[11px] text-muted-foreground">Issues, comments, watchers, subtasks, and saved filters are stored only in this browser.</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/20 px-4 py-3">
        {confirmingRestore
          ? <>
            <p role="alert" className="text-[10px] font-medium text-destructive">This permanently clears local issue changes and saved filters. Continue?</p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setConfirmingRestore(false)}>Cancel</Button>
              <Button variant="destructive" size="sm" onClick={restore}>Yes, restore sample data</Button>
            </div>
          </>
          : <>
            <p className="text-[10px] text-muted-foreground">Restore the original sample issues and clear local issue changes and saved filters.</p>
            <Button variant="outline" size="sm" onClick={() => setConfirmingRestore(true)}>Restore sample data</Button>
          </>}
      </div>
    </section>
  </div>
}

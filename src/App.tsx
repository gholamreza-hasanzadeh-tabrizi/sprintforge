import { useCallback, useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { ProjectPage } from '@/pages/project-page'

function initialTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem('sprintforge-theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme)
  const [toast, setToast] = useState('')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('sprintforge-theme', theme)
  }, [theme])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const showToast = useCallback((message: string) => {
    setToast(message)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(''), 2600)
  }, [])
  const toggleTheme = useCallback(() => setTheme((current) => current === 'dark' ? 'light' : 'dark'), [])

  return <>
    <ProjectPage theme={theme} onToggleTheme={toggleTheme} onToast={showToast}/>
    {toast && <div role="status" className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-xs font-medium text-background shadow-xl"><Check size={15} className="text-emerald-400"/>{toast}</div>}
  </>
}

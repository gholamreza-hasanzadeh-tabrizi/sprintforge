import type { WorkspaceLayoutProps } from '@/types/components/templates/workspace-layout'
import { AppSidebar } from '@/components/organisms/app-sidebar'
import { AppHeader } from '@/components/organisms/app-header'

export function WorkspaceLayout({ children, view, theme, onNavigate, onToggleTheme, onToast }: WorkspaceLayoutProps) {
  return <div className="min-h-screen bg-background text-foreground"><AppSidebar view={view} onNavigate={onNavigate} onToast={onToast}/><div className="min-h-screen md:ml-64"><AppHeader theme={theme} onToggleTheme={onToggleTheme} onToast={onToast}/><main className="mx-auto w-full max-w-[1600px] px-4 pb-6 pt-6 sm:px-7 lg:px-10">{children}</main></div></div>
}

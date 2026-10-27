import type { ReactNode } from 'react'
import type { View } from '@/types/domain/view'

export interface WorkspaceLayoutProps {
  children: ReactNode
  view: View
  theme: 'light' | 'dark'
  onNavigate: (view: View) => void
  onToggleTheme: () => void
  onToast: (message: string) => void
}

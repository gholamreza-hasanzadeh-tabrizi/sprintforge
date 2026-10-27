import type { View } from '@/types/domain/view'

export interface AppSidebarProps {
  view: View
  myWorkCount: number
  onNavigate: (view: View) => void
  onToast: (message: string) => void
}

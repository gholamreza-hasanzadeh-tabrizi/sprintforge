import type { View } from '@/types/domain/view'

export interface AppSidebarProps {
  view: View
  onNavigate: (view: View) => void
  onToast: (message: string) => void
}

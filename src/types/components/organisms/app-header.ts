export interface AppHeaderProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onToast: (message: string) => void
}

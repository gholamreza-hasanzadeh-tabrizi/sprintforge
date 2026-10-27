export interface SettingsViewProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onRestoreSample: () => void
}

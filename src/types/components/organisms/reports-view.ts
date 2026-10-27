import type { Issue } from '@/types/domain/issue'

export interface ReportsViewProps { issues: Issue[]; onToast: (message: string) => void }
export interface MetricProps { title: string; value: string; detail: string; progress: number; green?: boolean }

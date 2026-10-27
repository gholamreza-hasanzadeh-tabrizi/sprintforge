import type { Issue } from '@/types/domain/issue'

export interface ReportsViewProps { issues: Issue[]; onToast: (message: string) => void; onOpen: (issueId: string) => void; onViewActivity: () => void }
export interface MetricProps { title: string; value: string; detail: string; progress: number; green?: boolean }

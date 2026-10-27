import type { Issue } from '@/types/domain/issue'

export interface SprintSummaryProps { issues: Issue[]; onMore: () => void }

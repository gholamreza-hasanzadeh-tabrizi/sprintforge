export type IssueStatus = 'todo' | 'progress' | 'review' | 'done'
export type IssuePriority = 'Highest' | 'High' | 'Medium' | 'Low'
export type IssueType = 'Story' | 'Task' | 'Bug' | 'Epic'

export interface IssueComment {
  id: string
  author: string
  body: string
  createdAt: string
  editedAt?: string
}

export interface IssueActivity {
  id: string
  actor: string
  action: string
  createdAt: string
  commentId?: string
}

export interface Issue {
  id: string
  title: string
  description: string
  status: IssueStatus
  priority: IssuePriority
  type: IssueType
  assignee: string
  color: string
  points: number
  labels: string[]
  due?: string
  comments: IssueComment[]
  activity: IssueActivity[]
  watchers: string[]
  subtasks: Subtask[]
}

export interface Subtask {
  id: string
  title: string
  done: boolean
  assignee?: string
}

export type IssueDraft = Omit<Issue, 'id' | 'comments' | 'activity' | 'watchers' | 'subtasks'>

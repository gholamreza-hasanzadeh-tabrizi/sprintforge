import type { Issue, IssueComment, Subtask } from '@/types/domain/issue'

export const people = [
  { name: 'Olivia Chen', initials: 'OC', color: '#e6d5ff', role: 'Product' },
  { name: 'Marcus Reed', initials: 'MR', color: '#ccebe2', role: 'Engineering' },
  { name: 'Aisha Khan', initials: 'AK', color: '#ffd9d2', role: 'Design' },
  { name: 'Leo Martin', initials: 'LM', color: '#d5e4ff', role: 'Engineering' },
  { name: 'Sofia Garcia', initials: 'SG', color: '#ffedc2', role: 'QA' },
  { name: 'Noah Williams', initials: 'NW', color: '#d3f0f2', role: 'Engineering' },
]

const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString()
const comment = (id: string, author: string, body: string, minutesAgo: number): IssueComment => ({ id, author, body, createdAt: ago(minutesAgo) })

const issueSeeds: Omit<Issue, 'activity' | 'watchers' | 'subtasks'>[] = [
  { id: 'NOVA-128', title: 'Map the first-time user onboarding journey', description: 'Define the key moments from account creation to the first successful project invite. The flow should help a new team understand their next step without adding unnecessary setup friction.', status: 'todo', priority: 'High', type: 'Story', assignee: 'Aisha Khan', color: '#ffd9d2', points: 5, labels: ['UX', 'Onboarding'], comments: [comment('c-128-1', 'Olivia Chen', 'Could we make the first project invitation the primary activation moment?', 95), comment('c-128-2', 'Aisha Khan', 'Yes — I’ll bring two low-friction options to design review.', 42)] },
  { id: 'NOVA-134', title: 'Add workspace switching to the main navigation', description: 'Let members switch between workspaces without returning to the home screen.', status: 'todo', priority: 'Medium', type: 'Story', assignee: 'Olivia Chen', color: '#e6d5ff', points: 3, labels: ['Navigation'], comments: [comment('c-134-1', 'Marcus Reed', 'We should preserve the current project route when switching back.', 420)] },
  { id: 'NOVA-141', title: 'Audit empty states across the product', description: 'Create consistent empty states for projects, search, and activity.', status: 'todo', priority: 'Low', type: 'Task', assignee: 'Noah Williams', color: '#d3f0f2', points: 2, labels: ['Polish'], comments: [] },
  { id: 'NOVA-119', title: 'Create reusable project overview cards', description: 'Build a compact card with owner, status, dates, and completion progress.', status: 'progress', priority: 'High', type: 'Task', assignee: 'Marcus Reed', color: '#ccebe2', points: 5, labels: ['Components', 'UI'], comments: [comment('c-119-1', 'Marcus Reed', 'The card layout is in place. I’m checking long project names and smaller viewports next.', 35), comment('c-119-2', 'Olivia Chen', 'Please keep the progress label visible when a project has no due date.', 18)] },
  { id: 'NOVA-126', title: 'Implement keyboard shortcuts for the board', description: 'Support quick create and navigation with accessible keyboard shortcuts.', status: 'progress', priority: 'Medium', type: 'Story', assignee: 'Leo Martin', color: '#d5e4ff', points: 8, labels: ['Accessibility'], comments: [comment('c-126-1', 'Leo Martin', 'Cmd/Ctrl + K is working for search. I’ll add the shortcut reference to help.', 145)] },
  { id: 'NOVA-143', title: 'Fix layout shift in the project header', description: 'The project header shifts when the activity count loads.', status: 'progress', priority: 'Highest', type: 'Bug', assignee: 'Noah Williams', color: '#d3f0f2', points: 2, labels: ['Bug', 'Frontend'], comments: [comment('c-143-1', 'Sofia Garcia', 'Reproduced in Safari when the count changes from one to two digits.', 220)] },
  { id: 'NOVA-122', title: 'Review invitation email designs', description: 'Confirm the new invitation email works in common email clients.', status: 'review', priority: 'Medium', type: 'Task', assignee: 'Sofia Garcia', color: '#ffedc2', points: 3, labels: ['Email'], comments: [comment('c-122-1', 'Sofia Garcia', 'Gmail and Outlook look good. One spacing issue remains in Apple Mail.', 75)] },
  { id: 'NOVA-130', title: 'Add project activity feed', description: 'Show a chronological feed of project changes with actor and timestamp.', status: 'review', priority: 'High', type: 'Story', assignee: 'Marcus Reed', color: '#ccebe2', points: 5, labels: ['Activity'], comments: [comment('c-130-1', 'Olivia Chen', 'Please include status changes and comments in the first version.', 62), comment('c-130-2', 'Marcus Reed', 'Added both to the timeline. Ready for a final pass.', 24)] },
  { id: 'NOVA-111', title: 'Agree on shared design tokens', description: 'Document color, spacing, typography, and elevation tokens for the app.', status: 'done', priority: 'High', type: 'Task', assignee: 'Aisha Khan', color: '#ffd9d2', points: 3, labels: ['Design system'], comments: [comment('c-111-1', 'Aisha Khan', 'Tokens are documented and the component examples are updated.', 960)] },
  { id: 'NOVA-116', title: 'Add profile menu and account settings entry', description: 'Make account and workspace settings discoverable from the profile menu.', status: 'done', priority: 'Medium', type: 'Story', assignee: 'Olivia Chen', color: '#e6d5ff', points: 2, labels: ['Navigation'], comments: [] },
  { id: 'NOVA-121', title: 'Set up frontend error boundary', description: 'Add a clear recovery state for unexpected rendering errors.', status: 'done', priority: 'High', type: 'Task', assignee: 'Leo Martin', color: '#d5e4ff', points: 2, labels: ['Reliability'], comments: [comment('c-121-1', 'Leo Martin', 'Fallback includes a retry action and a support link.', 1510)] },
]

const seedSubtasks: Partial<Record<string, Subtask[]>> = {
  'NOVA-128': [
    { id: 'sub-128-1', title: 'Review onboarding references', done: true, assignee: 'Aisha Khan' },
    { id: 'sub-128-2', title: 'Draft first-session flow', done: false, assignee: 'Aisha Khan' },
  ],
  'NOVA-119': [
    { id: 'sub-119-1', title: 'Build project card layout', done: true, assignee: 'Marcus Reed' },
    { id: 'sub-119-2', title: 'Add loading and empty states', done: false, assignee: 'Marcus Reed' },
  ],
  'NOVA-130': [
    { id: 'sub-130-1', title: 'Implement activity event row', done: true, assignee: 'Marcus Reed' },
    { id: 'sub-130-2', title: 'Add timeline filters', done: false, assignee: 'Olivia Chen' },
  ],
}

export const initialIssues: Issue[] = issueSeeds.map((issue) => ({
  ...issue,
  watchers: ['NOVA-128', 'NOVA-130'].includes(issue.id) ? ['Olivia Chen'] : [],
  subtasks: seedSubtasks[issue.id] ?? [],
  activity: [
    { id: `created-${issue.id}`, actor: issue.assignee, action: 'created this issue', createdAt: ago(5_000) },
    ...issue.comments.map((entry) => ({ id: `activity-${entry.id}`, actor: entry.author, action: 'commented', createdAt: entry.createdAt, commentId: entry.id })),
  ].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
}))

export const statusMeta = {
  todo: { label: 'To do', color: '#8b93a3' },
  progress: { label: 'In progress', color: '#5b7df5' },
  review: { label: 'In review', color: '#aa74d5' },
  done: { label: 'Done', color: '#42a883' },
} as const

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectPage } from '@/pages/project-page'
import type { Issue } from '@/types/domain/issue'

beforeEach(() => localStorage.clear())

describe('ProjectPage issue workflow', () => {
  it('persists watch and subtask changes with the issue activity', async () => {
    const user = userEvent.setup()
    render(<ProjectPage theme="light" onToggleTheme={vi.fn()} onToast={vi.fn()}/>)

    await user.click(screen.getByRole('button', { name: /NOVA-134: Add workspace switching to the main navigation/ }))
    await user.click(screen.getByRole('button', { name: 'Watch issue; 0 watchers' }))
    await user.click(screen.getByRole('button', { name: 'Add subtask' }))
    await user.type(screen.getByRole('textbox', { name: 'Subtask title' }), 'Review final copy')
    await user.click(screen.getByRole('button', { name: 'Save subtask' }))
    await user.type(screen.getByRole('textbox', { name: 'Write a comment' }), 'Ready for review')
    await user.click(screen.getByRole('button', { name: 'Comment' }))

    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem('sprintforge-issues-v1') ?? '[]') as Issue[]
      const issue = saved.find((entry) => entry.id === 'NOVA-134')!
      expect(issue.watchers).toContain('Olivia Chen')
      expect(issue.subtasks.some((subtask) => subtask.title === 'Review final copy')).toBe(true)
      expect(issue.activity.some((event) => event.action.includes('added subtask'))).toBe(true)
      expect(issue.comments.some((comment) => comment.body === 'Ready for review')).toBe(true)
      expect(issue.activity.some((event) => event.action === 'commented')).toBe(true)
    })
  })

  it('clears saved filters only after the restore action is confirmed', async () => {
    const user = userEvent.setup()
    localStorage.setItem('sprintforge-saved-filters-v1', JSON.stringify([{ id: 'f1', name: 'Mine', status: 'all', priority: 'all', assignee: 'all', query: '' }]))
    render(<ProjectPage theme="light" onToggleTheme={vi.fn()} onToast={vi.fn()}/>)

    await user.click(screen.getByRole('tab', { name: /Settings/ }))
    // Only the settings card exposes the destructive action; the old header "···" shortcut is gone.
    const restore = screen.getByRole('button', { name: 'Restore sample data' })
    await user.click(restore)
    expect(localStorage.getItem('sprintforge-saved-filters-v1')).not.toBeNull()

    await user.click(screen.getByRole('button', { name: 'Yes, restore sample data' }))
    await waitFor(() => expect(localStorage.getItem('sprintforge-saved-filters-v1')).toBeNull())
  })
})

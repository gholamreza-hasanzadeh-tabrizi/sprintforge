import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { initialIssues } from '@/data'
import { ActivityView } from '@/components/organisms/activity-view'

describe('ActivityView', () => {
  it('lists updates across issues and opens the related issue', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(<ActivityView issues={initialIssues} onOpen={onOpen}/>)
    expect(screen.getByRole('heading', { name: 'Project activity' })).toBeInTheDocument()
    expect(screen.getAllByText('NOVA-128').length).toBeGreaterThan(0)
    const event = screen.getAllByRole('button', { name: /NOVA-128/ })[0]
    await user.click(event)
    expect(onOpen).toHaveBeenCalledWith('NOVA-128')
  })
})

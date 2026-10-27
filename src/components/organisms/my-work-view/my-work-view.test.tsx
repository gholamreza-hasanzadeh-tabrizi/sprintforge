import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { initialIssues } from '@/data'
import { MyWorkView } from '@/components/organisms/my-work-view'

describe('MyWorkView', () => {
  it('shows the current user’s work and opens an issue', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(<MyWorkView issues={initialIssues} onOpen={onOpen}/>)
    expect(screen.getByRole('heading', { name: 'My work' })).toBeInTheDocument()
    expect(screen.getByText('NOVA-134')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /NOVA-134/ }))
    expect(onOpen).toHaveBeenCalledWith('NOVA-134')
  })
})

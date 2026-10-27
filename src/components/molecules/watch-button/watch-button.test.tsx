import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WatchButton } from '@/components/molecules/watch-button'

describe('WatchButton', () => {
  it('exposes the watching state and toggles it', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<WatchButton watching={false} count={2} onToggle={onToggle}/>)
    const button = screen.getByRole('button', { name: 'Watch issue; 2 watchers' })
    expect(button).toHaveAttribute('aria-pressed', 'false')
    await user.click(button)
    expect(onToggle).toHaveBeenCalledOnce()
  })
})

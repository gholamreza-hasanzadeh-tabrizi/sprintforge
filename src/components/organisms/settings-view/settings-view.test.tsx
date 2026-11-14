import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SettingsView } from '@/components/organisms/settings-view'

describe('SettingsView', () => {
  it('exposes theme switching and asks for confirmation before restoring sample data', async () => {
    const user = userEvent.setup()
    const onToggleTheme = vi.fn()
    const onRestoreSample = vi.fn()
    render(<SettingsView theme="dark" onToggleTheme={onToggleTheme} onRestoreSample={onRestoreSample}/>)

    expect(screen.getByText(/Current theme:/).parentElement).toHaveTextContent('Dark')
    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }))
    expect(onToggleTheme).toHaveBeenCalledOnce()

    // A single click must not destroy local data.
    await user.click(screen.getByRole('button', { name: 'Restore sample data' }))
    expect(onRestoreSample).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent(/permanently clears/i)

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onRestoreSample).not.toHaveBeenCalled()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Restore sample data' }))
    await user.click(screen.getByRole('button', { name: 'Yes, restore sample data' }))
    expect(onRestoreSample).toHaveBeenCalledOnce()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('states that restoration clears saved filters as well as issue changes', () => {
    render(<SettingsView theme="light" onToggleTheme={vi.fn()} onRestoreSample={vi.fn()}/>)
    expect(screen.getByText(/saved filters are stored only in this browser/i)).toBeInTheDocument()
    expect(screen.getByText(/clear local issue changes and saved filters/i)).toBeInTheDocument()
  })
})

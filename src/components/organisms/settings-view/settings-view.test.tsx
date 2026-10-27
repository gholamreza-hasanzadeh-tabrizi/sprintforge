import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SettingsView } from '@/components/organisms/settings-view'

describe('SettingsView', () => {
  it('exposes theme switching and sample-data restoration actions', async () => {
    const user = userEvent.setup()
    const onToggleTheme = vi.fn()
    const onRestoreSample = vi.fn()
    render(<SettingsView theme="dark" onToggleTheme={onToggleTheme} onRestoreSample={onRestoreSample}/>)
    expect(screen.getByText(/Current theme:/).parentElement).toHaveTextContent('Dark')
    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }))
    await user.click(screen.getByRole('button', { name: 'Restore sample data' }))
    expect(onToggleTheme).toHaveBeenCalledOnce()
    expect(onRestoreSample).toHaveBeenCalledOnce()
  })
})

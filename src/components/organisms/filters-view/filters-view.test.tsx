import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { initialIssues } from '@/data'
import { FiltersView } from '@/components/organisms/filters-view'

beforeEach(() => localStorage.clear())
afterEach(() => localStorage.clear())

describe('FiltersView', () => {
  it('applies a quick filter and opens a matching issue', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(<FiltersView issues={initialIssues} onOpen={onOpen}/>)
    await user.click(screen.getByRole('button', { name: /High priority/ }))
    expect(screen.getAllByText('High priority').length).toBeGreaterThan(0)
    const match = screen.getAllByRole('button', { name: /NOVA-128/ })[0]
    await user.click(match)
    expect(onOpen).toHaveBeenCalledWith('NOVA-128')
  })

  it('saves a custom filter in localStorage and allows deleting it', async () => {
    const user = userEvent.setup()
    render(<FiltersView issues={initialIssues} onOpen={vi.fn()}/>)
    await user.type(screen.getByLabelText('Filter name'), 'Open bugs')
    await user.selectOptions(screen.getByLabelText('Status'), 'progress')
    await user.selectOptions(screen.getByLabelText('Priority'), 'Highest')
    await user.click(screen.getByRole('button', { name: 'Save filter' }))
    expect(await screen.findByRole('heading', { name: 'Open bugs' })).toBeInTheDocument()
    await waitFor(() => expect(JSON.parse(localStorage.getItem('sprintforge-saved-filters-v1') ?? '[]')).toHaveLength(1))
    await user.click(screen.getByRole('button', { name: 'Delete Open bugs' }))
    await waitFor(() => expect(JSON.parse(localStorage.getItem('sprintforge-saved-filters-v1') ?? '[]')).toHaveLength(0))
  })
})

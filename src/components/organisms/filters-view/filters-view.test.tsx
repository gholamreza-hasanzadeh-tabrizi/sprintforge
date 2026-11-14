import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { initialIssues } from '@/data'
import { FiltersView } from '@/components/organisms/filters-view'

const storageKey = 'sprintforge-saved-filters-v1'

beforeEach(() => localStorage.clear())
afterEach(() => localStorage.clear())

function resultIds(container: HTMLElement) {
  return Array.from(container.querySelectorAll('.divide-y button')).map((button) => button.querySelector('span')?.textContent ?? '')
}

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

  it('treats "High priority" as Highest or High and hides completed work', async () => {
    const user = userEvent.setup()
    const { container } = render(<FiltersView issues={initialIssues} onOpen={vi.fn()}/>)
    const preset = screen.getByRole('button', { name: /High priority/ })
    await user.click(preset)

    const ids = resultIds(container)
    expect(ids).toContain('NOVA-143') // Highest
    expect(ids).toContain('NOVA-128') // High
    expect(ids).not.toContain('NOVA-111') // High but done
    expect(ids).not.toContain('NOVA-121') // High but done
    expect(preset).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /Needs review/ })).toHaveAttribute('aria-pressed', 'false')
  })

  it('saves a custom filter in localStorage and allows deleting it', async () => {
    const user = userEvent.setup()
    render(<FiltersView issues={initialIssues} onOpen={vi.fn()}/>)
    await user.type(screen.getByLabelText('Filter name'), 'Open bugs')
    await user.selectOptions(screen.getByLabelText('Status'), 'progress')
    await user.selectOptions(screen.getByLabelText('Priority'), 'Highest')
    await user.click(screen.getByRole('button', { name: 'Save filter' }))
    expect(await screen.findByRole('heading', { name: 'Open bugs' })).toBeInTheDocument()
    await waitFor(() => expect(JSON.parse(localStorage.getItem(storageKey) ?? '[]')).toHaveLength(1))
    await user.click(screen.getByRole('button', { name: 'Delete Open bugs' }))
    await waitFor(() => expect(JSON.parse(localStorage.getItem(storageKey) ?? '[]')).toHaveLength(0))
  })

  it('narrows a saved filter by search text', async () => {
    const user = userEvent.setup()
    const { container } = render(<FiltersView issues={initialIssues} onOpen={vi.fn()}/>)
    await user.type(screen.getByLabelText('Filter name'), 'Onboarding work')
    await user.type(screen.getByLabelText('Search text (optional)'), 'onboarding')
    await user.click(screen.getByRole('button', { name: 'Save filter' }))

    const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]') as { query: string }[]
    expect(saved[0].query).toBe('onboarding')
    expect(resultIds(container)).toEqual(['NOVA-128'])
  })

  it('rejects a duplicate filter name with an accessible message', async () => {
    const user = userEvent.setup()
    render(<FiltersView issues={initialIssues} onOpen={vi.fn()}/>)
    await user.type(screen.getByLabelText('Filter name'), 'Triage')
    await user.click(screen.getByRole('button', { name: 'Save filter' }))
    await user.type(screen.getByLabelText('Filter name'), 'triage')

    expect(screen.getByText('A filter with this name already exists.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save filter' })).toBeDisabled()
    expect(JSON.parse(localStorage.getItem(storageKey) ?? '[]')).toHaveLength(1)
  })

  it('drops stored filters with invalid criteria instead of showing an empty result', () => {
    localStorage.setItem(storageKey, JSON.stringify([
      { id: 'broken', name: 'Broken', status: 'nope', priority: 'all', assignee: 'all', query: '' },
      { id: 'valid', name: 'Still here', status: 'review', priority: 'all', assignee: 'all', query: '' },
    ]))
    render(<FiltersView issues={initialIssues} onOpen={vi.fn()}/>)
    expect(screen.getByRole('button', { name: 'Still here' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Broken' })).not.toBeInTheDocument()
  })

  it('survives corrupted storage without overwriting it on mount', () => {
    localStorage.setItem(storageKey, '{not json')
    expect(() => render(<FiltersView issues={initialIssues} onOpen={vi.fn()}/>)).not.toThrow()
    expect(localStorage.getItem(storageKey)).toBe('{not json')
  })

  it('keeps the saved filters available after the view remounts', async () => {
    const user = userEvent.setup()
    const first = render(<FiltersView issues={initialIssues} onOpen={vi.fn()}/>)
    await user.type(screen.getByLabelText('Filter name'), 'Mine')
    await user.click(screen.getByRole('button', { name: 'Save filter' }))
    first.unmount()

    render(<FiltersView issues={initialIssues} onOpen={vi.fn()}/>)
    expect(screen.getByRole('button', { name: 'Mine' })).toBeInTheDocument()
  })
})

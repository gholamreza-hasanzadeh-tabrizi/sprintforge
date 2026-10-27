import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { initialIssues } from '@/data'
import { ReportsView } from '@/components/organisms/reports-view'

const originalCreateObjectURL = Object.getOwnPropertyDescriptor(URL, 'createObjectURL')
const originalRevokeObjectURL = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL')

describe('ReportsView', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    if (originalCreateObjectURL) Object.defineProperty(URL, 'createObjectURL', originalCreateObjectURL)
    else Reflect.deleteProperty(URL, 'createObjectURL')
    if (originalRevokeObjectURL) Object.defineProperty(URL, 'revokeObjectURL', originalRevokeObjectURL)
    else Reflect.deleteProperty(URL, 'revokeObjectURL')
  })

  it('renders status metrics from the current issues and opens an issue from activity', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(<ReportsView issues={initialIssues} onToast={vi.fn()} onOpen={onOpen} onViewActivity={vi.fn()}/>)
    expect(screen.getByText('Issue status distribution')).toBeInTheDocument()
    expect(screen.getByText('In progress')).toBeInTheDocument()
    const event = screen.getAllByRole('button').find((button) => button.textContent?.includes('NOVA-119'))
    expect(event).toBeTruthy()
    await user.click(event!)
    expect(onOpen).toHaveBeenCalledWith('NOVA-119')
  })

  it('exports the issue report as a CSV download', async () => {
    const user = userEvent.setup()
    const onToast = vi.fn()
    const createObjectURL = vi.fn(() => 'blob:sprintforge-test')
    const revokeObjectURL = vi.fn()
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createObjectURL })
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revokeObjectURL })
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    render(<ReportsView issues={initialIssues} onToast={onToast} onOpen={vi.fn()} onViewActivity={vi.fn()}/>)
    await user.click(screen.getByRole('button', { name: 'Export CSV' }))
    expect(createObjectURL).toHaveBeenCalledOnce()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:sprintforge-test')
    expect(onToast).toHaveBeenCalledWith('CSV report downloaded')
  })
})

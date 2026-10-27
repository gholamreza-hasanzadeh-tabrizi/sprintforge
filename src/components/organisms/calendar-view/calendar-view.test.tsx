import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { initialIssues } from '@/data'
import { CalendarView } from '@/components/organisms/calendar-view'

describe('CalendarView', () => {
  it('shows the current month, due dates, and navigates to issue details', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(<CalendarView issues={initialIssues} onOpen={onOpen}/>)
    expect(screen.getByRole('heading', { name: 'Calendar' })).toBeInTheDocument()
    expect(screen.getByText('Upcoming due dates')).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: /NOVA-119/ })[0])
    expect(onOpen).toHaveBeenCalledWith('NOVA-119')
  })

  it('moves between months', async () => {
    const user = userEvent.setup()
    render(<CalendarView issues={initialIssues} onOpen={vi.fn()}/>)
    const currentMonth = screen.getByText(new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date()))
    expect(currentMonth).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Next month' }))
    const nextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
    expect(screen.getByText(new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(nextMonth))).toBeInTheDocument()
  })
})

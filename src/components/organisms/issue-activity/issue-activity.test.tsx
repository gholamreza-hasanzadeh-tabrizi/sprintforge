import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { initialIssues } from '@/data'
import { IssueActivityFeed } from '@/components/organisms/issue-activity'

describe('IssueActivityFeed', () => {
  it('shows threaded comments for an issue', () => {
    const issue = initialIssues.find((entry) => entry.id === 'NOVA-128')!
    render(<IssueActivityFeed issue={issue} mode="comments"/>)
    expect(screen.getByText('Could we make the first project invitation the primary activation moment?')).toBeInTheDocument()
    expect(screen.getByText('Aisha Khan')).toBeInTheDocument()
  })

  it('shows issue creation and comment events in the activity timeline', () => {
    const issue = initialIssues.find((entry) => entry.id === 'NOVA-128')!
    render(<IssueActivityFeed issue={issue} mode="activity"/>)
    expect(screen.getByText('created this issue')).toBeInTheDocument()
    expect(screen.getByText('Could we make the first project invitation the primary activation moment?')).toBeInTheDocument()
  })
})

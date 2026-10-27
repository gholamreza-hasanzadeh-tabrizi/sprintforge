import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input, Select, Textarea } from '@/components/atoms/form-field'

describe('form controls', () => {
  it('supports native file inputs and error feedback', () => {
    render(<Input type="file" aria-label="Upload file" error="Choose a file" />)
    const input = screen.getByLabelText('Upload file')
    expect(input).toHaveAttribute('type', 'file')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('Choose a file')
  })

  it('supports adornments without stealing input focus', async () => {
    const user = userEvent.setup()
    render(<Input aria-label="Search" startAdornment={<span>⌕</span>} endAdornment={<button aria-label="Clear search">×</button>} />)
    const input = screen.getByRole('textbox', { name: 'Search' })
    await user.click(input)
    expect(input).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument()
  })

  it('supports select and textarea native behavior with errors', async () => {
    const user = userEvent.setup()
    render(<><Select aria-label="Status" error="Pick a status"><option>Open</option><option>Done</option></Select><Textarea aria-label="Description" maxLength={500}/></>)
    await user.selectOptions(screen.getByRole('combobox', { name: 'Status' }), 'Done')
    expect(screen.getByRole('combobox', { name: 'Status' })).toHaveValue('Done')
    expect(screen.getByRole('alert')).toHaveTextContent('Pick a status')
    expect(screen.getByRole('textbox', { name: 'Description' })).toHaveAttribute('maxlength', '500')
  })
})

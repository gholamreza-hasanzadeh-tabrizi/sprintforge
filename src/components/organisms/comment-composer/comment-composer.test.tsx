import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommentComposer } from '@/components/organisms/comment-composer'

describe('CommentComposer', () => {
  it('submits a trimmed comment and clears the editor', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<CommentComposer onSubmit={onSubmit} onToast={vi.fn()}/>)
    const editor = screen.getByRole('textbox', { name: 'Write a comment' })
    await user.type(editor, '  Looks good to me.  ')
    await user.click(screen.getByRole('button', { name: 'Comment' }))
    expect(onSubmit).toHaveBeenCalledWith('Looks good to me.')
    expect(editor).toHaveValue('')
  })

  it('supports Ctrl/Command + Enter to submit', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<CommentComposer onSubmit={onSubmit} onToast={vi.fn()}/>)
    const editor = screen.getByRole('textbox', { name: 'Write a comment' })
    await user.type(editor, 'Ready for review')
    await user.keyboard('{Control>}{Enter}{/Control}')
    expect(onSubmit).toHaveBeenCalledWith('Ready for review')
  })
})

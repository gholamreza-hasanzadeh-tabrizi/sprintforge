import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SubtaskList } from '@/components/molecules/subtask-list'

describe('SubtaskList', () => {
  it('adds subtasks and supports completion toggles', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    const onToggle = vi.fn()
    render(<SubtaskList subtasks={[{ id: 's-1', title: 'Ship UI', done: false }]} onAdd={onAdd} onToggle={onToggle} onDelete={vi.fn()}/>)
    await user.click(screen.getByRole('button', { name: 'Complete Ship UI' }))
    expect(onToggle).toHaveBeenCalledWith('s-1')
    await user.click(screen.getByRole('button', { name: 'Add subtask' }))
    await user.type(screen.getByRole('textbox', { name: 'Subtask title' }), 'Write tests')
    await user.click(screen.getByRole('button', { name: 'Save subtask' }))
    expect(onAdd).toHaveBeenCalledWith('Write tests')
  })
})

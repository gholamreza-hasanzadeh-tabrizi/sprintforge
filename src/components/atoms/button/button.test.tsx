import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ArrowRight, Plus } from 'lucide-react'
import { Button, IconButton } from '@/components/atoms/button'

const variants = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'success', 'warning', 'soft', 'link'] as const
const sizes = ['xs', 'sm', 'default', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'] as const

describe('Button', () => {
  it.each(variants)('renders the %s variant', (variant) => {
    render(<Button variant={variant}>Action</Button>)
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })

  it.each(sizes)('accepts the %s size', (size) => {
    render(<Button size={size} aria-label="Action"/> )
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })

  it('supports leading, trailing, and shorthand icons', () => {
    const { rerender } = render(<Button startIcon={<Plus data-testid="leading"/>} endIcon={<ArrowRight data-testid="trailing"/>}>Add item</Button>)
    expect(screen.getByTestId('leading')).toBeInTheDocument()
    expect(screen.getByTestId('trailing')).toBeInTheDocument()
    rerender(<Button icon={<Plus data-testid="shorthand"/>} iconPosition="end">Add item</Button>)
    expect(screen.getByTestId('shorthand')).toBeInTheDocument()
  })

  it('exposes loading state and prevents activation while loading', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button loading loadingLabel="Saving" onClick={onClick}>Save</Button>)
    const button = screen.getByRole('button', { name: 'Saving' })
    expect(button).toBeDisabled()
    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('requires an accessible label for IconButton', () => {
    render(<IconButton label="Add issue"><Plus/></IconButton>)
    expect(screen.getByRole('button', { name: 'Add issue' })).toBeInTheDocument()
  })

  it('supports Slot composition', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button asChild variant="outline" onClick={onClick}><a href="#board">Open board</a></Button>)
    const link = screen.getByRole('link', { name: 'Open board' })
    expect(link).toHaveClass('border')
    await user.click(link)
    expect(onClick).toHaveBeenCalledOnce()
  })
})

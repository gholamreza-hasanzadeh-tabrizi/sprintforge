import { Slot, Slottable } from '@radix-ui/react-slot'
import { LoaderCircle } from 'lucide-react'
import { cva } from 'class-variance-authority'
import type { ButtonProps, IconButtonProps } from '@/types/components/atoms/button'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-[color,background-color,border-color,box-shadow,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-border bg-card text-foreground shadow-sm hover:bg-muted',
        ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        success: 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400',
        warning: 'bg-amber-500 text-slate-950 shadow-sm hover:bg-amber-600',
        soft: 'bg-primary/10 text-primary hover:bg-primary/15',
        link: 'h-auto rounded-none p-0 text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-3.5 py-2',
        xs: 'h-7 rounded px-2 text-xs',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-md px-6 text-sm',
        icon: 'size-9 p-0',
        'icon-xs': 'size-7 p-0 [&_svg]:size-3.5',
        'icon-sm': 'size-8 p-0',
        'icon-lg': 'size-11 p-0 [&_svg]:size-5',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export function Button({ className, variant, size, type = 'button', asChild = false, loading = false, loadingLabel, startIcon, endIcon, icon, iconPosition = 'start', fullWidth = false, children, disabled, onClick, ...props }: ButtonProps) {
  const Component = asChild ? Slot : 'button'
  const leadingIcon = startIcon ?? (iconPosition === 'start' ? icon : undefined)
  const trailingIcon = endIcon ?? (iconPosition === 'end' ? icon : undefined)
  const handleClick: ButtonProps['onClick'] = (event) => {
    if (loading || disabled) { event.preventDefault(); event.stopPropagation(); return }
    onClick?.(event)
  }
  return <Component
    {...props}
    onClick={handleClick}
    {...(!asChild ? { type } : {})}
    disabled={!asChild ? (disabled || loading) : undefined}
    aria-disabled={asChild && (disabled || loading) ? true : undefined}
    aria-busy={loading || undefined}
    className={cn(buttonVariants({ variant, size }), fullWidth && 'w-full', className)}
  >
    {loading ? <LoaderCircle aria-hidden="true" className="animate-spin"/> : leadingIcon && <span aria-hidden="true" className="inline-flex">{leadingIcon}</span>}
    {asChild ? <Slottable>{children}</Slottable> : loading ? (loadingLabel ?? children) : children}
    {!loading && trailingIcon && <span aria-hidden="true" className="inline-flex">{trailingIcon}</span>}
  </Component>
}

export function IconButton({ label, className, size = 'icon', variant = 'ghost', ...props }: IconButtonProps) {
  return <Button {...props} variant={variant} size={size} aria-label={label} title={props.title ?? label} className={className}/>
}

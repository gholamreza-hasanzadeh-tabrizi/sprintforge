import { cva } from 'class-variance-authority'
import type { BadgeProps, StatusBadgeProps } from '@/types/components/atoms/badge'
import { cn } from '@/lib/utils'

export const badgeVariants = cva('inline-flex w-fit items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium leading-4 transition-colors', {
  variants: {
    variant: {
      default: 'border-transparent bg-primary text-primary-foreground',
      secondary: 'border-transparent bg-secondary text-secondary-foreground',
      outline: 'border-border bg-transparent text-foreground',
      muted: 'border-border bg-muted text-muted-foreground',
      destructive: 'border-transparent bg-destructive text-destructive-foreground',
      success: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300',
      warning: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300',
      info: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300',
    },
    size: { sm: 'px-1.5 py-0 text-[10px]', md: 'px-2 py-0.5 text-[11px]' },
  },
  defaultVariants: { variant: 'muted', size: 'md' },
})

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props}/>
}

const statusVariants: Record<string, NonNullable<BadgeProps['variant']>> = {
  todo: 'muted', progress: 'info', review: 'secondary', done: 'success',
}
export function StatusBadge({ status, label }: StatusBadgeProps) {
  return <Badge variant={statusVariants[status] ?? 'muted'} size="sm">{label}</Badge>
}

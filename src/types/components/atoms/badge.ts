import type { HTMLAttributes } from 'react'

export type BadgeVariant = 'default' | 'secondary' | 'outline' | 'muted' | 'destructive' | 'success' | 'warning' | 'info'
export type BadgeSize = 'sm' | 'md'
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant | null
  size?: BadgeSize | null
}
export interface StatusBadgeProps { status: string; label: string }

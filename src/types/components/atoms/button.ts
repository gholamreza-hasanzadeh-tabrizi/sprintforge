import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'warning' | 'soft' | 'link'
export type ButtonSize = 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'size'> {
  children?: ReactNode
  variant?: ButtonVariant | null
  size?: ButtonSize | null
  asChild?: boolean
  loading?: boolean
  loadingLabel?: string
  startIcon?: ReactNode
  endIcon?: ReactNode
  icon?: ReactNode
  iconPosition?: 'start' | 'end'
  fullWidth?: boolean
}

export interface IconButtonProps extends Omit<ButtonProps, 'aria-label'> {
  label: string
}

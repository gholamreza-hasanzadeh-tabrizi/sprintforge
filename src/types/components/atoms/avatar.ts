import type { ImgHTMLAttributes } from 'react'

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  name: string
  src?: string
  alt?: string
  fallback?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showStatus?: boolean
  online?: boolean
}

import type { SkeletonProps } from '@/types/components/atoms/skeleton'
import { cn } from '@/lib/utils'

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-md bg-muted', className)} {...props}/>
}

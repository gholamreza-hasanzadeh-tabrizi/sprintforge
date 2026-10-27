import { memo, useEffect, useState } from 'react'
import type { AvatarProps } from '@/types/components/atoms/avatar'
import { cn } from '@/lib/utils'
import { people } from '@/data'

export const Avatar = memo(function Avatar({ name, src, alt, fallback, size = 'md', showStatus = false, online = true, className, ...props }: AvatarProps) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])
  const person = people.find((entry) => entry.name === name)
  const initials = fallback ?? person?.initials ?? name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
  const sizeClass = { xs: 'size-5 text-[7px]', sm: 'size-7 text-[9px]', md: 'size-8 text-[10px]', lg: 'size-10 text-xs' }[size]
  return <span className={cn('relative inline-flex shrink-0', className)} title={name}>
    {src && !failed ? <img src={src} alt={alt ?? name} onError={() => setFailed(true)} className={cn('rounded-full border-2 border-card object-cover', sizeClass)} {...props}/> : <span aria-label={alt ?? name} role="img" className={cn('inline-flex items-center justify-center rounded-full border-2 border-card font-semibold text-slate-700 dark:text-slate-200', sizeClass)} style={{ backgroundColor: person?.color ?? '#d9e1ec' }}>{initials}</span>}
    {showStatus && <span aria-label={online ? 'Online' : 'Offline'} className={cn('absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-card', online ? 'bg-emerald-500' : 'bg-muted-foreground')}/>}
  </span>
})

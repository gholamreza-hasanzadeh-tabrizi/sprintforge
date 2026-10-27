import { Avatar } from '@/components/atoms/avatar'
import { Button } from '@/components/atoms/button'
import { UserRoundPlus } from 'lucide-react'
import type { AvatarStackProps } from '@/types/components/molecules/avatar-stack'

export function AvatarStack({ names, onInvite }: AvatarStackProps) {
  return <div className="flex items-center pl-1">{names.map((name) => <Avatar key={name} name={name} size="sm" className="-ml-1 first:ml-0" />)}<Button variant="outline" size="icon" className="ml-1 size-7 rounded-full border-dashed text-muted-foreground" onClick={onInvite} aria-label="Invite a teammate"><UserRoundPlus size={13}/></Button></div>
}

import { Eye } from 'lucide-react'
import { Button } from '@/components/atoms/button'
import type { WatchButtonProps } from '@/types/components/molecules/watch-button'

export function WatchButton({ watching, count, onToggle }: WatchButtonProps) {
  return <Button type="button" variant={watching ? 'soft' : 'outline'} size="sm" className="h-8" onClick={onToggle} startIcon={<Eye size={14}/>} aria-label={watching ? `Stop watching issue; ${count} watchers` : `Watch issue; ${count} watchers`} aria-pressed={watching}>
    {watching ? 'Watching' : 'Watch'}<span className="ml-0.5 text-[10px] opacity-70" aria-hidden="true">{count}</span>
  </Button>
}

import { Search, Command } from 'lucide-react'
import { Input } from '@/components/atoms/form-field'
import type { SearchFieldProps } from '@/types/components/molecules/search-field'

export function SearchField({ value, onChange, inputRef }: SearchFieldProps) {
  return <div className="relative w-full sm:w-56">
    <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
    <Input ref={inputRef} value={value} onChange={(event) => onChange(event.target.value)} aria-label="Search project issues" placeholder="Search issues..." className="h-9 pl-9 pr-12 text-xs" />
    <kbd className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground"><Command size={10} /> K</kbd>
  </div>
}

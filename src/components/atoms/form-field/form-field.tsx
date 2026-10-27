import { ChevronDown } from 'lucide-react'
import { forwardRef, useId } from 'react'
import type { FeedbackTextProps, FieldLabelProps, InputProps, SelectProps, TextareaProps } from '@/types/components/atoms/form-field'
import { cn } from '@/lib/utils'

const controlBase = 'w-full rounded-md border border-input bg-background text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive'
const inputSizes = { sm: 'h-8 px-2.5 text-xs', md: 'h-9 px-3', lg: 'h-11 px-3.5' } as const

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, wrapperClassName, size = 'md', startAdornment, endAdornment, error, id, 'aria-describedby': describedBy, ...props }, ref) {
  const generatedId = useId()
  const errorId = `${id ?? generatedId}-error`
  const input = <input ref={ref} id={id} aria-invalid={Boolean(error) || undefined} aria-describedby={[describedBy, typeof error === 'string' ? errorId : undefined].filter(Boolean).join(' ') || undefined} className={cn(controlBase, inputSizes[size], 'file:mr-3 file:rounded file:border-0 file:bg-secondary file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-secondary-foreground', startAdornment && 'pl-9', endAdornment && 'pr-9', className)} {...props} />
  return <div className={cn('w-full', wrapperClassName)}><div className="relative">{startAdornment && <span aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">{startAdornment}</span>}{input}{endAdornment && <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">{endAdornment}</span>}</div>{typeof error === 'string' && <FieldErrorText id={errorId}>{error}</FieldErrorText>}</div>
})

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ className, wrapperClassName, error, id, 'aria-describedby': describedBy, children, hideChevron = false, ...props }, ref) {
  const generatedId = useId()
  const errorId = `${id ?? generatedId}-error`
  return <div className={cn('relative', wrapperClassName)}><select ref={ref} id={id} aria-invalid={Boolean(error) || undefined} aria-describedby={[describedBy, typeof error === 'string' ? errorId : undefined].filter(Boolean).join(' ') || undefined} className={cn(controlBase, 'h-9 appearance-none px-3 pr-8', className)} {...props}>{children}</select>{!hideChevron && <ChevronDown aria-hidden="true" size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"/>}{typeof error === 'string' && <FieldErrorText id={errorId}>{error}</FieldErrorText>}</div>
})

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ className, wrapperClassName, error, id, 'aria-describedby': describedBy, ...props }, ref) {
  const generatedId = useId()
  const errorId = `${id ?? generatedId}-error`
  return <div className={cn('w-full', wrapperClassName)}><textarea ref={ref} id={id} aria-invalid={Boolean(error) || undefined} aria-describedby={[describedBy, typeof error === 'string' ? errorId : undefined].filter(Boolean).join(' ') || undefined} className={cn(controlBase, 'min-h-24 resize-y px-3 py-2.5', className)} {...props}/>{typeof error === 'string' && <FieldErrorText id={errorId}>{error}</FieldErrorText>}</div>
})

export function FieldLabel({ className, required, children, ...props }: FieldLabelProps) {
  return <label className={cn('mb-1.5 block text-xs font-medium text-foreground', className)} {...props}>{children}{required && <span aria-hidden="true" className="ml-1 text-destructive">*</span>}</label>
}

export function FormDescription({ className, ...props }: FeedbackTextProps) {
  return <p className={cn('mt-1.5 text-[11px] leading-relaxed text-muted-foreground', className)} {...props}/>
}

export function FieldErrorText({ className, ...props }: FeedbackTextProps) {
  return <p role="alert" className={cn('mt-1.5 text-[11px] font-medium text-destructive', className)} {...props}/>
}

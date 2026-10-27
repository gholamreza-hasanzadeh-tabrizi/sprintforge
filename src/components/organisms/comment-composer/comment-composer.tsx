import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { AtSign, Paperclip, Send } from 'lucide-react'
import { Avatar } from '@/components/atoms/avatar'
import { Button, IconButton } from '@/components/atoms/button'
import { Textarea } from '@/components/atoms/form-field'
import type { CommentComposerProps } from '@/types/components/organisms/comment-composer'

export function CommentComposer({ onSubmit, onToast }: CommentComposerProps) {
  const [body, setBody] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = body.trim()
    if (!value) return
    onSubmit(value)
    setBody('')
  }
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }
  return <form onSubmit={submit} className="rounded-lg border border-input bg-background shadow-sm focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10"><div className="flex gap-3 p-3"><Avatar name="Olivia Chen" size="sm" className="mt-1"/><Textarea value={body} onChange={(event) => setBody(event.target.value)} onKeyDown={handleKeyDown} aria-label="Write a comment" placeholder="Write a comment… Use @ to mention someone" rows={3} className="min-h-20 border-0 bg-transparent px-0 py-1 shadow-none focus-visible:ring-0"/></div><div className="flex items-center justify-between border-t border-border/70 px-2 py-2"><div className="flex items-center gap-1"><IconButton label="Add attachment" size="icon-xs" className="text-muted-foreground" onClick={() => onToast('Attachments will be available when the backend is added')}><Paperclip size={14}/></IconButton><IconButton label="Insert mention" size="icon-xs" className="text-muted-foreground" onClick={() => setBody((value) => `${value}${value && !value.endsWith(' ') ? ' ' : ''}@`)}><AtSign size={14}/></IconButton><span className="ml-1 hidden text-[10px] text-muted-foreground sm:inline">⌘ / Ctrl + Enter to send</span></div><Button type="submit" size="sm" disabled={!body.trim()} startIcon={<Send size={13}/>}>Comment</Button></div></form>
}

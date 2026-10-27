import type { HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

export type FieldError = string | boolean | undefined
export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize
  startAdornment?: ReactNode
  endAdornment?: ReactNode
  error?: FieldError
  wrapperClassName?: string
}
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: FieldError
  wrapperClassName?: string
  hideChevron?: boolean
}
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: FieldError
  wrapperClassName?: string
}
export interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> { required?: boolean }
export interface FeedbackTextProps extends HTMLAttributes<HTMLParagraphElement> {}

import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'

import { cn } from '@/shared/utils/cn'

import { textareaVariants } from './textarea.styles'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return <textarea className={cn(textareaVariants(), className)} ref={ref} {...props} />
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }

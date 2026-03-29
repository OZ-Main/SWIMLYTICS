import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

import { cn } from '@/shared/utils/cn'

import { inputVariants } from './input.styles'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input type={type} className={cn(inputVariants(), className)} ref={ref} {...props} />
    )
  },
)
Input.displayName = 'Input'

export { Input }

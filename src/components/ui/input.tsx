import * as React from 'react'

import { cn } from '@/shared/utils/cn'

import { inputVariants } from './input.styles'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input type={type} className={cn(inputVariants(), className)} ref={ref} {...props} />
    )
  },
)
Input.displayName = 'Input'

export { Input }

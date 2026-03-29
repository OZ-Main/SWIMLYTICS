import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'

import { cn } from '@/shared/utils/cn'

import { separatorVariants } from './separator.styles'

const Separator = forwardRef<
  ElementRef<typeof SeparatorPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(separatorVariants({ orientation }), className)}
    {...props}
  />
))
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }

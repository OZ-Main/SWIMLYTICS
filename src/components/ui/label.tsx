import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { type VariantProps } from 'class-variance-authority'

import { cn } from '@/shared/utils/cn'

import { labelVariants } from './label.styles'

const Label = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/shared/utils/cn'

import {
  emptyStateActionsVariants,
  emptyStateDescriptionVariants,
  emptyStateIconVariants,
  emptyStateIconWrapVariants,
  emptyStateRootVariants,
  emptyStateTitleVariants,
} from './EmptyState.styles'

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description: string
  className?: string
  action?: ReactNode
  secondaryAction?: ReactNode
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  className,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div
      className={cn(emptyStateRootVariants(), className)}
      role="status"
      aria-live="polite"
    >
      <div className={emptyStateIconWrapVariants()}>
        <Icon className={emptyStateIconVariants()} aria-hidden />
      </div>
      <h3 className={emptyStateTitleVariants()}>{title}</h3>
      <p className={emptyStateDescriptionVariants()}>{description}</p>
      {action || secondaryAction ? (
        <div className={emptyStateActionsVariants()}>
          {action}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  )
}

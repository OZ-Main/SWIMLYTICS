import type { ReactNode } from 'react'

import { cn } from '@/shared/utils/cn'

import {
  pageHeaderActionsVariants,
  pageHeaderRootVariants,
  pageHeaderTitleVariants,
} from './PageHeader.styles'

type PageHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export default function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn(pageHeaderRootVariants(), className)}>
      <div>
        <h1 className={pageHeaderTitleVariants()}>{title}</h1>
        {description ? <p className="page-lead">{description}</p> : null}
      </div>
      {actions ? <div className={pageHeaderActionsVariants()}>{actions}</div> : null}
    </div>
  )
}

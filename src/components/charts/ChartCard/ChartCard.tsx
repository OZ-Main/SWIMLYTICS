import * as React from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/shared/utils/cn'

import {
  chartCardDescriptionVariants,
  chartCardHeaderVariants,
  chartCardRootVariants,
  chartCardTitleVariants,
} from './ChartCard.styles'

type ChartCardProps = {
  title: string
  description?: string
  children: React.ReactNode
  contentClassName?: string
}

export default function ChartCard({
  title,
  description,
  children,
  contentClassName,
}: ChartCardProps) {
  return (
    <Card className={chartCardRootVariants()}>
      <CardHeader className={chartCardHeaderVariants()}>
        <CardTitle className={chartCardTitleVariants()}>{title}</CardTitle>
        {description ? (
          <CardDescription className={chartCardDescriptionVariants()}>{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className={cn('p-0', contentClassName)}>{children}</CardContent>
    </Card>
  )
}

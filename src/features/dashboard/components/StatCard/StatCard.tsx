import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  cardInteractiveSurfaceVariants,
  cardRootVariants,
} from '@/components/ui/card.styles'
import { cn } from '@/shared/utils/cn'
import type { MetricType } from '@/shared/domain'

import {
  statCardBodyVariants,
  statCardHeaderRowVariants,
  statCardHintVariants,
  statCardIconWrapVariants,
  statCardLinkVariants,
  statCardTitleRowVariants,
  statCardTitleVariants,
  statCardValueVariants,
} from './StatCard.styles'

type StatCardProps = {
  title: string
  value: string
  hint?: string
  icon: LucideIcon
  /** Destination when the KPI is activated (keyboard or pointer). */
  to: string
  /** Overrides default `${title}, ${value}` for screen readers. */
  ariaLabel?: string
  className?: string
  /** Identifies the KPI for analytics / testing. */
  metric?: MetricType
}

export default function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  to,
  ariaLabel,
  className,
  metric,
}: StatCardProps) {
  return (
    <Link
      to={to}
      className={cn(
        cardRootVariants(),
        cardInteractiveSurfaceVariants(),
        statCardLinkVariants(),
        className,
      )}
      data-metric={metric}
      aria-label={ariaLabel ?? `${title}, ${value}`}
    >
      <div className={statCardHeaderRowVariants()}>
        <div className={statCardTitleRowVariants()}>
          <h3 className={statCardTitleVariants()}>{title}</h3>
          <span className={statCardIconWrapVariants()} aria-hidden>
            <Icon className="h-4 w-4" />
          </span>
        </div>
      </div>
      <div className={statCardBodyVariants()}>
        <p className={statCardValueVariants()}>{value}</p>
        {hint ? <p className={statCardHintVariants()}>{hint}</p> : null}
      </div>
    </Link>
  )
}

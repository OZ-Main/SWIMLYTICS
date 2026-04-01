import { useTranslation } from 'react-i18next'

import {
  formatChartTooltipLabel,
  formatChartTooltipValue,
  type TooltipPayloadEntry,
} from '@/lib/charts/chartTooltip.helpers'
import { cn } from '@/shared/utils/cn'

import {
  chartTooltipLabelVariants,
  chartTooltipListItemVariants,
  chartTooltipListVariants,
  chartTooltipRootVariants,
  chartTooltipSeriesNameVariants,
} from './ChartTooltipContent.styles'

type ChartTooltipContentProps = {
  active?: boolean
  payload?: TooltipPayloadEntry[]
  label?: string
  className?: string
}

export default function ChartTooltipContent({
  active,
  payload,
  label,
  className,
}: ChartTooltipContentProps) {
  const { t } = useTranslation()

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className={cn(chartTooltipRootVariants(), className)}>
      {label !== undefined && label !== '' ? (
        <p className={chartTooltipLabelVariants()}>{formatChartTooltipLabel(String(label))}</p>
      ) : null}
      <ul className={cn(chartTooltipListVariants(), label ? 'mt-tight' : undefined)}>
        {payload.map((entry, index) => (
          <li
            key={`${String(entry.dataKey)}-${String(entry.name)}-${index}`}
            className={chartTooltipListItemVariants()}
          >
            <span className={chartTooltipSeriesNameVariants()}>
              {entry.name ?? t('charts.tooltipValueFallback')}
            </span>
            {': '}
            {formatChartTooltipValue(entry)}
          </li>
        ))}
      </ul>
    </div>
  )
}

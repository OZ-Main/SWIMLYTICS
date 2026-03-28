import { cva } from 'class-variance-authority'

export const chartTooltipRootVariants = cva(
  'rounded-card border border-border/70 bg-card px-3 py-2 text-caption text-foreground shadow-card',
)

export const chartTooltipLabelVariants = cva('font-medium text-foreground')

export const chartTooltipListVariants = cva('space-y-0.5')

export const chartTooltipListItemVariants = cva('text-muted-foreground')

export const chartTooltipSeriesNameVariants = cva('font-medium text-foreground')

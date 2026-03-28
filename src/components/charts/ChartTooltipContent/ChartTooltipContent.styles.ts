import { cva } from 'class-variance-authority'

export const chartTooltipRootVariants = cva(
  'rounded-card border border-border/80 bg-gradient-to-br from-card to-card-subtle px-3 py-2.5 text-caption text-foreground shadow-card-hover shadow-[inset_3px_0_0_0_hsl(var(--accent))]',
)

export const chartTooltipLabelVariants = cva('font-medium text-foreground')

export const chartTooltipListVariants = cva('space-y-0.5')

export const chartTooltipListItemVariants = cva('text-muted-foreground')

export const chartTooltipSeriesNameVariants = cva('font-medium text-foreground')

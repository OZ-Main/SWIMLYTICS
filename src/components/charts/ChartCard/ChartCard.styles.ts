import { cva } from 'class-variance-authority'

/** Shell comes from `Card` (`cardRootVariants`); only motion + clip here. */
export const chartCardRootVariants = cva('motion-mount-chart overflow-hidden')

export const chartCardHeaderVariants = cva('page-section-header')

export const chartCardTitleVariants = cva('page-section-title')

export const chartCardDescriptionVariants = cva(
  'text-caption leading-relaxed text-muted-foreground',
)

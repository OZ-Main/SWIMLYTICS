import { cva } from 'class-variance-authority'

export const statCardLinkVariants = cva(
  'block border-l-stat border-l-accent/70 text-inherit no-underline',
)

export const statCardHeaderRowVariants = cva('flex flex-col gap-1.5 p-card')

export const statCardTitleRowVariants = cva(
  'flex flex-row items-start justify-between space-y-0 pb-2',
)

export const statCardTitleVariants = cva('text-label font-medium text-muted-foreground')

export const statCardIconWrapVariants = cva('rounded-button bg-primary/10 p-2 text-primary')

export const statCardBodyVariants = cva('p-card pt-0')

export const statCardValueVariants = cva(
  'font-display text-kpi tabular-nums tracking-tight text-foreground',
)

export const statCardHintVariants = cva('mt-1 text-caption text-muted-foreground')

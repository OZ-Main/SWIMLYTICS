import { cva } from 'class-variance-authority'

export const pageHeaderRootVariants = cva('page-toolbar')

export const pageHeaderTitleVariants = cva(
  'font-display text-display-lg font-bold tracking-tight text-foreground',
)

export const pageHeaderActionsVariants = cva('flex shrink-0 flex-wrap gap-tight')

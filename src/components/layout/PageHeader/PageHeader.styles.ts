import { cva } from 'class-variance-authority'

export const pageHeaderRootVariants = cva('page-toolbar')

export const pageHeaderTitleVariants = cva(
  'font-display text-heading-xl font-bold tracking-tight text-foreground sm:text-display-lg',
)

export const pageHeaderActionsVariants = cva(
  'flex w-full min-w-0 shrink-0 flex-col gap-tight sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end',
)

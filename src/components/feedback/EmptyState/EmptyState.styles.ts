import { cva } from 'class-variance-authority'

export const emptyStateRootVariants = cva(
  'surface-panel-muted motion-mount-surface flex flex-col items-center justify-center px-card py-section text-center',
)

export const emptyStateIconWrapVariants = cva(
  'mb-stack flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground',
)

export const emptyStateIconVariants = cva('h-6 w-6')

export const emptyStateTitleVariants = cva(
  'font-display text-heading-md font-semibold text-foreground',
)

export const emptyStateDescriptionVariants = cva(
  'mt-tight max-w-md text-body-sm leading-relaxed text-muted-foreground',
)

export const emptyStateActionsVariants = cva(
  'mt-relaxed flex flex-col items-center gap-stack sm:flex-row sm:flex-wrap sm:justify-center',
)

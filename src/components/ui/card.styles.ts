import { cva } from 'class-variance-authority'

export const cardRootVariants = cva(
  'rounded-card border border-border/80 bg-gradient-to-br from-card to-card-subtle text-card-foreground shadow-card',
)

export const cardInteractiveSurfaceVariants = cva(
  'cursor-pointer transition-[transform,box-shadow] duration-motion-normal ease-motion-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
)

export const cardHeaderVariants = cva('flex flex-col gap-1.5 p-card')

export const cardTitleVariants = cva('font-display text-heading-md font-semibold')

export const cardDescriptionVariants = cva('text-body-sm text-muted-foreground')

export const cardContentVariants = cva('p-card pt-0')

export const cardFooterVariants = cva('flex items-center p-card pt-0')

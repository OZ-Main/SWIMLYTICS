import { cva } from 'class-variance-authority'

export const dialogOverlayVariants = cva(
  'fixed inset-0 z-50 bg-foreground/35 backdrop-blur-[2px] data-[state=closed]:duration-motion-normal data-[state=open]:duration-motion-normal data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
)

export const dialogContentVariants = cva(
  'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-stack rounded-dialog border border-border bg-card p-dialog text-card-foreground shadow-overlay duration-motion-normal ease-motion-emphasized data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
)

export const dialogCloseVariants = cva(
  'absolute right-dialog top-dialog rounded-sm opacity-70 ring-offset-background transition-opacity duration-motion-fast ease-motion-out hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-muted',
)

export const dialogHeaderVariants = cva('flex flex-col gap-tight text-center sm:text-left')

export const dialogFooterVariants = cva(
  'flex flex-col-reverse gap-tight sm:flex-row sm:justify-end',
)

export const dialogTitleVariants = cva('font-display text-heading-lg font-semibold')

export const dialogDescriptionVariants = cva('text-body-sm text-muted-foreground')

import { cva } from 'class-variance-authority'

export const sheetOverlayVariants = cva(
  'pointer-events-none fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm data-[state=open]:pointer-events-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:duration-motion-slow data-[state=open]:duration-motion-normal',
)

export const sheetContentVariants = cva(
  'fixed inset-y-0 left-0 z-50 flex h-full w-[min(20rem,92vw)] max-w-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-overlay ease-motion-emphasized data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left data-[state=closed]:duration-motion-slow data-[state=open]:duration-motion-normal',
)

export const sheetCloseVariants = cva(
  'inline-flex shrink-0 rounded-button p-2 text-sidebar-foreground opacity-90 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-sidebar-accent focus:ring-offset-2 focus:ring-offset-sidebar disabled:pointer-events-none',
)

export const sheetHeaderVariants = cva(
  'flex flex-col gap-tight border-b border-sidebar-border px-4 py-4 text-left',
)

export const sheetTitleVariants = cva('font-display text-heading-md font-bold tracking-tight text-sidebar-foreground')

export const sheetDescriptionVariants = cva('text-body-sm text-sidebar-muted')

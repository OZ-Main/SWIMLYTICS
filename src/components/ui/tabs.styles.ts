import { cva } from 'class-variance-authority'

export const tabsListVariants = cva(
  'inline-flex h-10 items-center justify-center rounded-input bg-muted p-1 text-muted-foreground',
)

export const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-label font-medium ring-offset-background transition-[color,background-color,box-shadow,transform] duration-motion-fast ease-motion-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm motion-safe:data-[state=active]:scale-[1.02]',
)

export const tabsContentVariants = cva(
  'mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
)

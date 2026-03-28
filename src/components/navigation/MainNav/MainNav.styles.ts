import { cva } from 'class-variance-authority'

export const mainNavRootVariants = cva('flex flex-col gap-tight', {
  variants: {
    collapsed: {
      true: 'items-stretch gap-1',
      false: '',
    },
  },
  defaultVariants: {
    collapsed: false,
  },
})

export const mainNavLinkVariants = cva(
  'flex items-center rounded-md text-body-sm font-medium transition-[background-color,color,transform] duration-motion-fast ease-motion-out motion-safe:hover:scale-[1.01] md:text-body',
  {
    variants: {
      active: {
        true: 'bg-sidebar-accent text-sidebar-accent-foreground',
        false:
          'text-sidebar-foreground/90 hover:bg-sidebar-accent/22 hover:text-sidebar-foreground',
      },
      collapsed: {
        true: 'min-h-11 w-full justify-center gap-0 px-0 py-0 motion-safe:hover:scale-100',
        false: 'gap-3 px-3 py-2',
      },
    },
    defaultVariants: {
      active: false,
      collapsed: false,
    },
  },
)

export const mainNavIconVariants = cva('shrink-0 opacity-90', {
  variants: {
    collapsed: {
      true: 'h-5 w-5',
      false: 'h-4 w-4',
    },
  },
  defaultVariants: {
    collapsed: false,
  },
})

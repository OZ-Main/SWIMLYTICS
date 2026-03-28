import { cva } from 'class-variance-authority'

export const appShellRootVariants = cva('min-h-dvh min-h-screen')

export const appShellOuterFlexVariants = cva('mx-auto flex w-full')

export const appShellDesktopAsideVariants = cva(
  'sticky top-0 hidden h-screen shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-motion-normal ease-motion-standard motion-reduce:transition-none md:flex md:flex-col',
  {
    variants: {
      expanded: {
        true: 'w-sidebar',
        false: 'w-sidebar-collapsed',
      },
    },
    defaultVariants: {
      expanded: true,
    },
  },
)

export const appShellSidebarHeaderRowVariants = cva(
  'flex h-sidebar-header shrink-0 items-center border-b border-sidebar-border',
  {
    variants: {
      expanded: {
        true: 'gap-2 px-card',
        false: 'justify-center px-2',
      },
    },
    defaultVariants: {
      expanded: true,
    },
  },
)

export const appShellSidebarBrandTextVariants = cva(
  'min-w-0 flex-1 truncate font-display text-heading-md font-semibold tracking-tight text-sidebar-foreground',
)

export const appShellSidebarToggleButtonVariants = cva(
  'shrink-0 text-sidebar-foreground hover:bg-sidebar-border/60 hover:text-sidebar-foreground motion-safe:hover:scale-100 motion-safe:active:scale-100',
)

export const appShellMainColumnVariants = cva('flex min-h-screen min-w-0 flex-1 flex-col')

export const appShellMobileHeaderVariants = cva(
  'flex h-header-mobile items-center justify-between gap-tight border-b border-border/80 bg-background/80 px-3 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 sm:px-4 md:hidden',
)

export const appShellMobileMenuButtonVariants = cva('shrink-0 touch-manipulation')

export const appShellMobileHeaderSpacerVariants = cva('w-10 shrink-0')

export const appShellMainContentVariants = cva(
  'flex-1 px-3 pb-6 pt-5 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-4 sm:pb-7 sm:pt-6 md:px-page-padding-x lg:px-page-padding-x-lg lg:py-page-y',
)

export const appShellMobileNavSheetContentVariants = cva('flex flex-col p-0 md:hidden')

export const appShellMobileNavSheetHeaderVariants = cva(
  'flex h-header-mobile shrink-0 items-center justify-between border-b border-sidebar-border px-4',
)

export const appShellMobileNavSheetTitleVariants = cva(
  'font-display text-heading-sm font-bold tracking-tight text-sidebar-foreground',
)

export const appShellMobileNavScrollAreaVariants = cva(
  'flex-1 overflow-y-auto overscroll-contain px-2 pb-6 pt-2',
)

export const appShellMobileBrandVariants = cva(
  'min-w-0 flex-1 truncate text-center font-display text-heading-sm font-semibold tracking-tight',
)

export const appShellMainWidthCapVariants = cva('mx-auto w-full max-w-content')

export const appShellSkipLinkVariants = cva(
  'fixed left-4 top-0 z-[100] -translate-y-full rounded-button bg-primary px-3 py-2 text-label font-medium text-primary-foreground shadow-overlay transition-transform duration-motion-fast ease-motion-out focus:translate-y-3 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
)

export const appShellSidebarFooterVariants = cva('px-3 pb-card')

export const appShellSidebarFooterInnerVariants = cva('px-3')

export const appShellDesktopMainNavVariants = cva('flex-1 py-section-sm', {
  variants: {
    expanded: {
      true: 'px-3',
      false: 'px-2',
    },
  },
  defaultVariants: {
    expanded: true,
  },
})

import { ChevronsLeft, ChevronsRight } from 'lucide-react'

import { PageTransitionOutlet } from '@/components/motion'
import MainNav from '@/components/navigation/MainNav'
import { Button } from '@/components/ui/button'
import { cn } from '@/shared/utils/cn'

import { useSidebarExpanded } from './useSidebarExpanded'

export default function AppShell() {
  const { expanded, toggle } = useSidebarExpanded()

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full">
        <aside
          className={cn(
            'sticky top-0 hidden h-screen shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-motion-normal ease-motion-standard motion-reduce:transition-none md:flex md:flex-col',
            expanded ? 'w-sidebar' : 'w-sidebar-collapsed',
          )}
        >
          <div
            className={cn(
              'flex h-sidebar-header shrink-0 items-center border-b border-sidebar-border',
              expanded ? 'gap-2 px-card' : 'justify-center px-2',
            )}
          >
            {expanded ? (
              <span className="min-w-0 flex-1 truncate font-display text-heading-md font-semibold tracking-tight text-sidebar-foreground">
                SWIMLYTICS
              </span>
            ) : (
              <span className="sr-only">SWIMLYTICS</span>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-sidebar-foreground hover:bg-sidebar-border/60 hover:text-sidebar-foreground motion-safe:hover:scale-100 motion-safe:active:scale-100"
              aria-expanded={expanded}
              aria-controls="desktop-main-nav"
              aria-label={
                expanded ? 'Collapse navigation sidebar' : 'Expand navigation sidebar'
              }
              onClick={toggle}
            >
              {expanded ? (
                <ChevronsLeft className="h-4 w-4" aria-hidden />
              ) : (
                <ChevronsRight className="h-4 w-4" aria-hidden />
              )}
            </Button>
          </div>

          <MainNav
            id="desktop-main-nav"
            collapsed={!expanded}
            className={cn('flex-1 py-section-sm', expanded ? 'px-3' : 'px-2')}
          />

          <div
            className={cn('px-3 pb-card', !expanded && 'hidden')}
            aria-hidden={!expanded}
          >
            <div className="px-3">
              <span className="h-4 w-4 shrink-0" aria-hidden />
              <p className="text-caption text-sidebar-muted">Coach analytics</p>
            </div>
          </div>
        </aside>
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="px-page-padding-x flex h-header-mobile items-center border-b border-border md:hidden">
            <span className="font-display text-heading-sm font-semibold tracking-tight">
              SWIMLYTICS
            </span>
          </header>
          <div className="px-page-padding-x border-b border-border py-tight md:hidden">
            <MainNav className="flex flex-row flex-wrap gap-tight" />
          </div>
          <a
            href="#main-content"
            className="fixed left-4 top-0 z-[100] -translate-y-full rounded-button bg-primary px-3 py-2 text-label font-medium text-primary-foreground shadow-overlay transition-transform duration-motion-fast ease-motion-out focus:translate-y-3 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            Skip to main content
          </a>
          <main
            id="main-content"
            tabIndex={-1}
            className="px-page-padding-x lg:px-page-padding-x-lg flex-1 py-page-y outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <div className="mx-auto w-full max-w-content">
              <PageTransitionOutlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

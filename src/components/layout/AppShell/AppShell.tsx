import { ChevronsLeft, ChevronsRight, Menu } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { PageTransitionOutlet } from '@/components/motion'
import MainNav from '@/components/navigation/MainNav'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetCloseButton,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { MEDIA_QUERY_MIN_MD } from '@/shared/constants/tailwindBreakpointMedia.constants'
import { cn } from '@/shared/utils/cn'

import {
  appShellDesktopAsideVariants,
  appShellDesktopMainNavVariants,
  appShellMainColumnVariants,
  appShellMainContentVariants,
  appShellMainWidthCapVariants,
  appShellMobileBrandVariants,
  appShellMobileHeaderSpacerVariants,
  appShellMobileHeaderVariants,
  appShellMobileMenuButtonVariants,
  appShellMobileNavScrollAreaVariants,
  appShellMobileNavSheetContentVariants,
  appShellMobileNavSheetHeaderVariants,
  appShellMobileNavSheetTitleVariants,
  appShellOuterFlexVariants,
  appShellRootVariants,
  appShellSidebarBrandTextVariants,
  appShellSidebarFooterInnerVariants,
  appShellSidebarFooterVariants,
  appShellSidebarHeaderRowVariants,
  appShellSidebarToggleButtonVariants,
  appShellSkipLinkVariants,
} from './AppShell.styles'
import { useSidebarExpanded } from './useSidebarExpanded'

export default function AppShell() {
  const { expanded, toggle } = useSidebarExpanded()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const isMdUp = useMediaQuery(MEDIA_QUERY_MIN_MD)

  const handleOpenMobileNav = useCallback(() => {
    setMobileNavOpen(true)
  }, [])

  const handleCloseMobileNav = useCallback(() => {
    setMobileNavOpen(false)
  }, [])

  useEffect(() => {
    if (isMdUp) {
      setMobileNavOpen(false)
    }
  }, [isMdUp])

  return (
    <div className={appShellRootVariants()}>
      <div className={appShellOuterFlexVariants()}>
        <aside className={appShellDesktopAsideVariants({ expanded })}>
          <div className={appShellSidebarHeaderRowVariants({ expanded })}>
            {expanded ? (
              <span className={appShellSidebarBrandTextVariants()}>SWIMLYTICS</span>
            ) : (
              <span className="sr-only">SWIMLYTICS</span>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={appShellSidebarToggleButtonVariants()}
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
            className={appShellDesktopMainNavVariants({ expanded })}
          />

          <div
            className={cn(appShellSidebarFooterVariants(), !expanded && 'hidden')}
            aria-hidden={!expanded}
          >
            <div className={appShellSidebarFooterInnerVariants()}>
              <span className="h-4 w-4 shrink-0" aria-hidden />
              <p className="text-caption text-sidebar-muted">Coach analytics</p>
            </div>
          </div>
        </aside>
        <div className={appShellMainColumnVariants()}>
          <header className={appShellMobileHeaderVariants()}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={appShellMobileMenuButtonVariants()}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-main-nav"
              aria-label="Open navigation menu"
              onClick={handleOpenMobileNav}
            >
              <Menu className="h-5 w-5" aria-hidden />
            </Button>
            <span className={appShellMobileBrandVariants()}>SWIMLYTICS</span>
            <span className={appShellMobileHeaderSpacerVariants()} aria-hidden />
          </header>
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetContent className={appShellMobileNavSheetContentVariants()}>
              <SheetDescription className="sr-only">
                Application sections: dashboard, athletes, statistics, and settings.
              </SheetDescription>
              <div className={appShellMobileNavSheetHeaderVariants()}>
                <SheetTitle className={appShellMobileNavSheetTitleVariants()}>Menu</SheetTitle>
                <SheetCloseButton label="Close navigation menu" />
              </div>
              <MainNav
                id="mobile-main-nav"
                mode="drawer"
                onNavigate={handleCloseMobileNav}
                className={appShellMobileNavScrollAreaVariants()}
              />
            </SheetContent>
          </Sheet>
          <a href="#main-content" className={appShellSkipLinkVariants()}>
            Skip to main content
          </a>
          <main id="main-content" tabIndex={-1} className={appShellMainContentVariants()}>
            <div className={appShellMainWidthCapVariants()}>
              <PageTransitionOutlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

import { PageTransitionOutlet } from '@/components/motion'
import MainNav from '@/components/navigation/MainNav/MainNav'

export default function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full">
        <aside className="sticky top-0 hidden h-screen w-sidebar shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex md:flex-col">
          <div className="flex h-sidebar-header items-center border-b border-sidebar-border px-card">
            <span className="font-display text-heading-md font-semibold tracking-tight text-sidebar-foreground">
              SWIMLYTICS
            </span>
          </div>

          <MainNav className="flex-1 px-3 py-section-sm" />

          <div className="px-3 pb-card">
            <div className="px-3">
              <span className="h-4 w-4 shrink-0" aria-hidden />
              <p className="text-caption text-sidebar-muted">Training analytics</p>
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

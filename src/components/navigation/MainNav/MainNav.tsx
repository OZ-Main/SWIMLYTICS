import { BarChart3, Home, Settings, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { APP_ROUTE } from '@/shared/constants/routes.constants'
import { cn } from '@/shared/utils/cn'

import {
  mainNavDrawerIconVariants,
  mainNavDrawerLinkVariants,
  mainNavIconVariants,
  mainNavLinkVariants,
  mainNavRootVariants,
} from './MainNav.styles'

const LINKS = [
  { to: APP_ROUTE.home, label: 'Dashboard', icon: Home },
  { to: APP_ROUTE.athletes, label: 'Athletes', icon: Users },
  { to: APP_ROUTE.statistics, label: 'Statistics', icon: BarChart3 },
  { to: APP_ROUTE.settings, label: 'Settings', icon: Settings },
] as const

type MainNavProps = {
  id?: string
  className?: string
  collapsed?: boolean
  mode?: 'sidebar' | 'drawer'
  onNavigate?: () => void
}

export default function MainNav({
  id,
  className,
  collapsed = false,
  mode = 'sidebar',
  onNavigate,
}: MainNavProps) {
  const isDrawer = mode === 'drawer'

  function handleNavigate() {
    if (!onNavigate) {
      return
    }
    if (isDrawer) {
      window.setTimeout(() => onNavigate(), 0)
      return
    }
    onNavigate()
  }

  return (
    <nav
      id={id}
      className={cn(mainNavRootVariants({ mode, collapsed: isDrawer ? false : collapsed }), className)}
      aria-label="Main navigation"
    >
      {LINKS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === APP_ROUTE.home}
          title={!isDrawer && collapsed ? label : undefined}
          aria-label={label}
          onClick={handleNavigate}
          className={({ isActive }) =>
            isDrawer
              ? mainNavDrawerLinkVariants({ active: isActive })
              : mainNavLinkVariants({ active: isActive, collapsed })
          }
        >
          <Icon
            className={isDrawer ? mainNavDrawerIconVariants() : mainNavIconVariants({ collapsed })}
            aria-hidden
          />
          {isDrawer || !collapsed ? <span>{label}</span> : null}
        </NavLink>
      ))}
    </nav>
  )
}

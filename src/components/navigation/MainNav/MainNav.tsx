import { BarChart3, Home, Settings, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { APP_ROUTE } from '@/shared/constants/routes.constants'
import { cn } from '@/shared/utils/cn'

import { mainNavIconVariants, mainNavLinkVariants, mainNavRootVariants } from './MainNav.styles'

const LINKS = [
  { to: APP_ROUTE.home, label: 'Dashboard', icon: Home },
  { to: APP_ROUTE.athletes, label: 'Athletes', icon: Users },
  { to: APP_ROUTE.statistics, label: 'Statistics', icon: BarChart3 },
  { to: APP_ROUTE.settings, label: 'Settings', icon: Settings },
] as const

type MainNavProps = {
  id?: string
  className?: string
  /**
   * Desktop sidebar icon rail. Ignored on mobile (horizontal nav always shows labels).
   * Each link keeps `title` + `aria-label` for tooltips and screen readers.
   */
  collapsed?: boolean
}

export default function MainNav({ id, className, collapsed = false }: MainNavProps) {
  return (
    <nav
      id={id}
      className={cn(mainNavRootVariants({ collapsed }), className)}
      aria-label="Main navigation"
    >
      {LINKS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === APP_ROUTE.home}
          title={collapsed ? label : undefined}
          aria-label={label}
          className={({ isActive }) =>
            mainNavLinkVariants({ active: isActive, collapsed })
          }
        >
          <Icon className={mainNavIconVariants({ collapsed })} aria-hidden />
          {collapsed ? null : <span>{label}</span>}
        </NavLink>
      ))}
    </nav>
  )
}

import { BarChart3, Home, Medal, Settings, Waves } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { APP_ROUTE } from '@/shared/constants/routes.constants'
import { cn } from '@/shared/utils/cn'

import { mainNavIconVariants, mainNavLinkVariants, mainNavRootVariants } from './MainNav.styles'

const LINKS = [
  { to: APP_ROUTE.home, label: 'Dashboard', icon: Home },
  { to: APP_ROUTE.workouts, label: 'Workouts', icon: Waves },
  { to: APP_ROUTE.statistics, label: 'Statistics', icon: BarChart3 },
  { to: APP_ROUTE.personalBests, label: 'Personal bests', icon: Medal },
  { to: APP_ROUTE.settings, label: 'Settings', icon: Settings },
] as const

type MainNavProps = {
  className?: string
}

export default function MainNav({ className }: MainNavProps) {
  return (
    <nav className={cn(mainNavRootVariants(), className)}>
      {LINKS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === APP_ROUTE.home}
          className={({ isActive }) => mainNavLinkVariants({ active: isActive })}
        >
          <Icon className={mainNavIconVariants()} aria-hidden />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

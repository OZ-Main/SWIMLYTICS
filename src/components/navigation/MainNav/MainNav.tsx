import { BarChart3, ClipboardList, Home, LayoutTemplate, Settings, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
  { to: APP_ROUTE.home, labelKey: 'nav.dashboard' as const, icon: Home },
  { to: APP_ROUTE.athletes, labelKey: 'nav.athletes' as const, icon: Users },
  { to: APP_ROUTE.workoutTemplates, labelKey: 'nav.templates' as const, icon: LayoutTemplate },
  { to: APP_ROUTE.assignmentsNew, labelKey: 'nav.assign' as const, icon: ClipboardList },
  { to: APP_ROUTE.statistics, labelKey: 'nav.statistics' as const, icon: BarChart3 },
  { to: APP_ROUTE.settings, labelKey: 'nav.settings' as const, icon: Settings },
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
  const { t } = useTranslation()
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
      aria-label={t('nav.mainNav')}
    >
      {LINKS.map(({ to, labelKey, icon: Icon }) => {
        const label = t(labelKey)
        return (
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
        )
      })}
    </nav>
  )
}

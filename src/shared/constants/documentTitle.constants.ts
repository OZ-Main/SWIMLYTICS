import { APP_ROUTE } from '@/shared/constants/routes.constants'

/** Browser tab titles (not including product suffix). */
export const DOCUMENT_TITLE = {
  APP: 'SWIMLYTICS',
  DASHBOARD: 'Dashboard',
  ATHLETES: 'Athletes',
  NEW_ATHLETE: 'New athlete',
  ATHLETE: 'Athlete',
  EDIT_ATHLETE: 'Edit athlete',
  NEW_SESSION: 'New session',
  EDIT_SESSION: 'Edit session',
  SESSION_DETAIL: 'Session',
  ATHLETE_PBS: 'Personal bests',
  STATISTICS: 'Statistics',
  SETTINGS: 'Settings',
} as const

export const DOCUMENT_TITLE_SUFFIX = ` · ${DOCUMENT_TITLE.APP}`

/** Match pathname to title (dynamic athlete/workout segments). */
export function documentTitleForPathname(pathname: string): string {
  const p = pathname.replace(/\/$/, '') || '/'

  if (p === APP_ROUTE.home) {
    return DOCUMENT_TITLE.DASHBOARD
  }
  if (p === APP_ROUTE.statistics) {
    return DOCUMENT_TITLE.STATISTICS
  }
  if (p === APP_ROUTE.settings) {
    return DOCUMENT_TITLE.SETTINGS
  }
  if (p === APP_ROUTE.athletes) {
    return DOCUMENT_TITLE.ATHLETES
  }
  if (p === APP_ROUTE.athleteNew) {
    return DOCUMENT_TITLE.NEW_ATHLETE
  }

  if (/^\/athletes\/[^/]+\/personal-bests$/.test(p)) {
    return DOCUMENT_TITLE.ATHLETE_PBS
  }
  if (/^\/athletes\/[^/]+\/sessions\/new$/.test(p)) {
    return DOCUMENT_TITLE.NEW_SESSION
  }
  if (/^\/athletes\/[^/]+\/sessions\/[^/]+\/edit$/.test(p)) {
    return DOCUMENT_TITLE.EDIT_SESSION
  }
  if (/^\/athletes\/[^/]+\/sessions\/[^/]+$/.test(p)) {
    return DOCUMENT_TITLE.SESSION_DETAIL
  }
  if (/^\/athletes\/[^/]+\/edit$/.test(p)) {
    return DOCUMENT_TITLE.EDIT_ATHLETE
  }
  if (/^\/athletes\/[^/]+$/.test(p)) {
    return DOCUMENT_TITLE.ATHLETE
  }

  return DOCUMENT_TITLE.APP
}

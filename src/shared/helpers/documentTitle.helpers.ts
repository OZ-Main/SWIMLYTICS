import i18n from '@/i18n/config'
import { APP_ROUTE } from '@/shared/constants/routes.constants'

export function documentTitleForPathname(pathname: string): string {
  const path = pathname.replace(/\/$/, '') || '/'
  const { t } = i18n

  if (path === APP_ROUTE.login) {
    return t('titles.signIn')
  }

  if (path === APP_ROUTE.signUp) {
    return t('titles.signUp')
  }

  if (path === APP_ROUTE.home) {
    return t('titles.dashboard')
  }

  if (path === APP_ROUTE.statistics) {
    return t('titles.statistics')
  }

  if (path === APP_ROUTE.settings) {
    return t('titles.settings')
  }

  if (path === APP_ROUTE.athletes) {
    return t('titles.athletes')
  }

  if (path === APP_ROUTE.athleteNew) {
    return t('titles.newAthlete')
  }

  if (path === APP_ROUTE.workoutTemplates) {
    return t('titles.workoutTemplates')
  }

  if (path === APP_ROUTE.workoutTemplateNew) {
    return t('titles.newWorkoutTemplate')
  }

  if (path === APP_ROUTE.assignmentsNew) {
    return t('titles.bulkAssignment')
  }

  if (/^\/workout-templates\/[^/]+\/edit$/.test(path)) {
    return t('titles.editWorkoutTemplate')
  }

  if (/^\/athletes\/[^/]+\/personal-bests$/.test(path)) {
    return t('titles.athletePbs')
  }

  if (/^\/athletes\/[^/]+\/sessions\/new$/.test(path)) {
    return t('titles.newSession')
  }

  if (/^\/athletes\/[^/]+\/sessions\/[^/]+\/edit$/.test(path)) {
    return t('titles.editSession')
  }

  if (/^\/athletes\/[^/]+\/sessions\/[^/]+$/.test(path)) {
    return t('titles.sessionDetail')
  }

  if (/^\/athletes\/[^/]+\/edit$/.test(path)) {
    return t('titles.editAthlete')
  }

  if (/^\/athletes\/[^/]+$/.test(path)) {
    return t('titles.athlete')
  }

  return t('app.name')
}

export function documentTitleSuffix(): string {
  return i18n.t('titles.suffix', { app: i18n.t('app.name') })
}

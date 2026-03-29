import { DOCUMENT_TITLE } from '@/shared/constants/documentTitle.constants'
import { APP_ROUTE } from '@/shared/constants/routes.constants'

export function documentTitleForPathname(pathname: string): string {
  const path = pathname.replace(/\/$/, '') || '/'

  if (path === APP_ROUTE.login) {
    return DOCUMENT_TITLE.SIGN_IN
  }

  if (path === APP_ROUTE.signUp) {
    return DOCUMENT_TITLE.SIGN_UP
  }

  if (path === APP_ROUTE.home) {
    return DOCUMENT_TITLE.DASHBOARD
  }

  if (path === APP_ROUTE.statistics) {
    return DOCUMENT_TITLE.STATISTICS
  }

  if (path === APP_ROUTE.settings) {
    return DOCUMENT_TITLE.SETTINGS
  }

  if (path === APP_ROUTE.athletes) {
    return DOCUMENT_TITLE.ATHLETES
  }

  if (path === APP_ROUTE.athleteNew) {
    return DOCUMENT_TITLE.NEW_ATHLETE
  }

  if (path === APP_ROUTE.workoutTemplates) {
    return DOCUMENT_TITLE.WORKOUT_TEMPLATES
  }

  if (path === APP_ROUTE.workoutTemplateNew) {
    return DOCUMENT_TITLE.NEW_WORKOUT_TEMPLATE
  }

  if (path === APP_ROUTE.assignmentsNew) {
    return DOCUMENT_TITLE.BULK_ASSIGNMENT
  }

  if (/^\/workout-templates\/[^/]+\/edit$/.test(path)) {
    return DOCUMENT_TITLE.EDIT_WORKOUT_TEMPLATE
  }

  if (/^\/athletes\/[^/]+\/personal-bests$/.test(path)) {
    return DOCUMENT_TITLE.ATHLETE_PBS
  }

  if (/^\/athletes\/[^/]+\/sessions\/new$/.test(path)) {
    return DOCUMENT_TITLE.NEW_SESSION
  }

  if (/^\/athletes\/[^/]+\/sessions\/[^/]+\/edit$/.test(path)) {
    return DOCUMENT_TITLE.EDIT_SESSION
  }

  if (/^\/athletes\/[^/]+\/sessions\/[^/]+$/.test(path)) {
    return DOCUMENT_TITLE.SESSION_DETAIL
  }

  if (/^\/athletes\/[^/]+\/edit$/.test(path)) {
    return DOCUMENT_TITLE.EDIT_ATHLETE
  }

  if (/^\/athletes\/[^/]+$/.test(path)) {
    return DOCUMENT_TITLE.ATHLETE
  }

  return DOCUMENT_TITLE.APP
}

import { APP_ROUTE } from '@/shared/constants/routes.constants'

/** Browser tab titles (not including product suffix). */
export const DOCUMENT_TITLE = {
  APP: 'SWIMLYTICS',
  DASHBOARD: 'Dashboard',
  WORKOUTS: 'Workouts',
  NEW_WORKOUT: 'New workout',
  EDIT_WORKOUT: 'Edit workout',
  WORKOUT_DETAIL: 'Workout',
  STATISTICS: 'Statistics',
  PERSONAL_BESTS: 'Personal bests',
  SETTINGS: 'Settings',
} as const

export const DOCUMENT_TITLE_SUFFIX = ` · ${DOCUMENT_TITLE.APP}`

/** Static path → title for `DocumentTitleSync`. */
export const DOCUMENT_TITLE_BY_STATIC_ROUTE: Record<
  (typeof APP_ROUTE)[keyof typeof APP_ROUTE],
  string
> = {
  [APP_ROUTE.home]: DOCUMENT_TITLE.DASHBOARD,
  [APP_ROUTE.workouts]: DOCUMENT_TITLE.WORKOUTS,
  [APP_ROUTE.workoutNew]: DOCUMENT_TITLE.NEW_WORKOUT,
  [APP_ROUTE.statistics]: DOCUMENT_TITLE.STATISTICS,
  [APP_ROUTE.personalBests]: DOCUMENT_TITLE.PERSONAL_BESTS,
  [APP_ROUTE.settings]: DOCUMENT_TITLE.SETTINGS,
}

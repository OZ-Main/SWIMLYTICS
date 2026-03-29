export const DOCUMENT_TITLE = {
  APP: 'SWIMLYTICS',
  SIGN_IN: 'Sign in',
  SIGN_UP: 'Sign up',
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
  WORKOUT_TEMPLATES: 'Workout templates',
  NEW_WORKOUT_TEMPLATE: 'New workout template',
  EDIT_WORKOUT_TEMPLATE: 'Edit workout template',
  BULK_ASSIGNMENT: 'Bulk assign workout',
} as const

export const DOCUMENT_TITLE_SUFFIX = ` · ${DOCUMENT_TITLE.APP}`

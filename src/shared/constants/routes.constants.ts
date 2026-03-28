/** App route paths (absolute, for links and document title matching). */
export const APP_ROUTE = {
  home: '/',
  workouts: '/workouts',
  workoutNew: '/workouts/new',
  statistics: '/statistics',
  personalBests: '/personal-bests',
  settings: '/settings',
} as const

export function workoutDetailPath(workoutId: string): string {
  return `${APP_ROUTE.workouts}/${workoutId}`
}

export function workoutEditPath(workoutId: string): string {
  return `${APP_ROUTE.workouts}/${workoutId}/edit`
}

/** React Router `Route` path segments (relative to shell layout). */
export const ROUTE_SEGMENT = {
  index: '',
  workouts: 'workouts',
  new: 'new',
  edit: 'edit',
  workoutIdParam: ':workoutId',
  statistics: 'statistics',
  personalBests: 'personal-bests',
  settings: 'settings',
  wildcard: '*',
} as const

/** `useParams` keys */
export const ROUTE_PARAM = {
  workoutId: 'workoutId',
} as const

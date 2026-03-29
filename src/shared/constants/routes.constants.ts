export const APP_ROUTE = {
  home: '/',
  login: '/login',
  signUp: '/sign-up',
  athletes: '/athletes',
  athleteNew: '/athletes/new',
  statistics: '/statistics',
  settings: '/settings',
  workoutTemplates: '/workout-templates',
  workoutTemplateNew: '/workout-templates/new',
  assignmentsNew: '/assignments/new',
} as const

export function athleteDetailPath(athleteId: string): string {
  return `${APP_ROUTE.athletes}/${athleteId}`
}

export function athleteEditPath(athleteId: string): string {
  return `${APP_ROUTE.athletes}/${athleteId}/edit`
}

export function athleteSessionNewPath(athleteId: string): string {
  return `${APP_ROUTE.athletes}/${athleteId}/sessions/new`
}

export function sessionDetailPath(athleteId: string, sessionId: string): string {
  return `${APP_ROUTE.athletes}/${athleteId}/sessions/${sessionId}`
}

export function sessionEditPath(athleteId: string, sessionId: string): string {
  return `${APP_ROUTE.athletes}/${athleteId}/sessions/${sessionId}/edit`
}

export function athletePersonalBestsPath(athleteId: string): string {
  return `${APP_ROUTE.athletes}/${athleteId}/personal-bests`
}

export function workoutTemplateEditPath(templateId: string): string {
  return `${APP_ROUTE.workoutTemplates}/${templateId}/edit`
}

export const ROUTE_SEGMENT = {
  index: '',
  login: 'login',
  signUp: 'sign-up',
  athletes: 'athletes',
  new: 'new',
  edit: 'edit',
  sessions: 'sessions',
  personalBests: 'personal-bests',
  athleteIdParam: ':athleteId',
  sessionIdParam: ':sessionId',
  statistics: 'statistics',
  settings: 'settings',
  workoutTemplates: 'workout-templates',
  assignments: 'assignments',
  templateIdParam: ':templateId',
  wildcard: '*',
} as const

export const ROUTE_PARAM = {
  athleteId: 'athleteId',
  sessionId: 'sessionId',
  templateId: 'templateId',
} as const

export const APP_ROUTE = {
  home: '/',
  athletes: '/athletes',
  athleteNew: '/athletes/new',
  statistics: '/statistics',
  settings: '/settings',
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

export const ROUTE_SEGMENT = {
  index: '',
  athletes: 'athletes',
  new: 'new',
  edit: 'edit',
  sessions: 'sessions',
  personalBests: 'personal-bests',
  athleteIdParam: ':athleteId',
  sessionIdParam: ':sessionId',
  statistics: 'statistics',
  settings: 'settings',
  wildcard: '*',
} as const

export const ROUTE_PARAM = {
  athleteId: 'athleteId',
  sessionId: 'sessionId',
} as const

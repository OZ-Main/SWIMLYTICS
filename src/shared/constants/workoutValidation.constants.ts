import { PoolLength } from '@/shared/domain'

export const WORKOUT_DISTANCE = {
  MIN_METERS: 25,
  MAX_METERS: 50_000,
  STEP_METERS: 25,
} as const

export const WORKOUT_DURATION = {
  MAX_MINUTES: 600,
  MAX_SECONDS_COMPONENT: 59,
} as const

export const WORKOUT_PACE = {
  MIN_SEC_PER_100M: 40,
  MAX_SEC_PER_100M: 600,
} as const

export const WORKOUT_NOTES = {
  MAX_LENGTH: 2000,
} as const

export const GYM_SESSION_FOCUS = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 120,
} as const

export const GYM_DURATION = {
  MAX_MINUTES: 600,
  MAX_SECONDS_COMPONENT: 59,
} as const

export const WORKOUT_FORM_DEFAULTS = {
  DISTANCE_METERS: 1000,
  DURATION_MINUTES: 20,
  DURATION_SECONDS: 0,
} as const

export const POOL_LENGTH_VALUES: readonly PoolLength[] = [
  PoolLength.Meters25,
  PoolLength.Meters50,
] as const

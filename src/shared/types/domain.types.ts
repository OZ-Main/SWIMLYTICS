import type { EffortLevel, PersonalBestDistance, PoolLength, Stroke } from '@/shared/domain'

export type { EffortLevel, PersonalBestDistance, PoolLength, Stroke } from '@/shared/domain'

export type Workout = {
  id: string
  date: string
  poolLength: PoolLength
  stroke: Stroke
  distance: number
  duration: number
  averagePacePer100: number
  effortLevel: EffortLevel
  notes: string
}

export type PersonalBest = {
  id: string
  /** Stroke / event type for this mark (e.g. freestyle, IM). */
  stroke: Stroke
  distance: PersonalBestDistance
  timeSeconds: number
  date: string
  notes: string
}

export type DashboardSummary = {
  totalWorkouts: number
  totalDistanceMeters: number
  totalDurationSeconds: number
  averagePacePer100Seconds: number | null
  currentWeekDistanceMeters: number
}

export type NamedChartPoint = {
  name: string
  value: number
}

export type TimeSeriesPoint = {
  date: string
  value: number
}

export type StrokeSlice = {
  stroke: Stroke
  count: number
  distanceMeters: number
}

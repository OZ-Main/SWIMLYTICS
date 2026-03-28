/**
 * Flat workout row shape — only used for migrating persisted v2 exports and legacy storage.
 * @see TrainingSession
 */
import type { EffortLevel, PoolLength, Stroke } from '@/shared/domain'
import { AthleteTrainingType as AttTypeEnum } from '@/shared/domain'

export type LegacySwimmingWorkout = {
  id: string
  athleteId: string
  date: string
  notes: string
  trainingType: typeof AttTypeEnum.Swimming
  poolLength: PoolLength
  stroke: Stroke
  distance: number
  duration: number
  /** Present on persisted v2 rows; not required for session migration. */
  averagePacePer100: number
  effortLevel: EffortLevel
}

export type LegacyGymWorkout = {
  id: string
  athleteId: string
  date: string
  notes: string
  trainingType: typeof AttTypeEnum.Gym
  sessionFocus: string
  durationSeconds: number
  effortLevel: EffortLevel
}

export type LegacyWorkout = LegacySwimmingWorkout | LegacyGymWorkout

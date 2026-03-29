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

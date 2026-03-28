import type {
  AthleteTrainingType,
  DrillType,
  EffortLevel,
  GymBlockCategory,
  PersonalBestDistance,
  PoolLength,
  Stroke,
  SwimEquipment,
  SwimmingBlockCategory,
} from '@/shared/domain'
import { AthleteTrainingType as AttTypeEnum } from '@/shared/domain'

export type {
  AthleteTrainingType,
  DrillType,
  EffortLevel,
  GymBlockCategory,
  PersonalBestDistance,
  PoolLength,
  Stroke,
  SwimEquipment,
  SwimmingBlockCategory,
} from '@/shared/domain'

/** Discriminator literals — avoids magic strings in domain logic. */
export const SESSION_BLOCK_KIND = {
  Swimming: 'swimming',
  Gym: 'gym',
} as const

export type SessionBlockKind = (typeof SESSION_BLOCK_KIND)[keyof typeof SESSION_BLOCK_KIND]

/** Local coach profile (single-user install; ready for future multi-coach sync). */
export type Coach = {
  id: string
  displayName: string
  createdAt: string
}

export type Athlete = {
  id: string
  fullName: string
  trainingType: AthleteTrainingType
  notes: string
  createdAt: string
}

export type PersonalBest = {
  id: string
  athleteId: string
  stroke: Stroke
  distance: PersonalBestDistance
  timeSeconds: number
  date: string
  notes: string
}

export type TrainingSessionBlockBase = {
  id: string
  orderIndex: number
  title: string
  notes: string
}

export type SwimmingSessionBlock = TrainingSessionBlockBase & {
  kind: typeof SESSION_BLOCK_KIND.Swimming
  category: SwimmingBlockCategory
  stroke: Stroke
  effortLevel: EffortLevel
  poolLength: PoolLength
  /** When both > 0, distance = repetitions × distancePerRepMeters. */
  repetitions: number
  distancePerRepMeters: number
  /** Used when repetitions or per-rep distance is zero (simple continuous distance). */
  explicitTotalDistanceMeters: number
  durationSeconds: number
  drillType: DrillType
  intervalSendoffSeconds: number | null
  equipment: SwimEquipment[]
}

export type GymSessionBlock = TrainingSessionBlockBase & {
  kind: typeof SESSION_BLOCK_KIND.Gym
  category: GymBlockCategory
  focus: string
  durationSeconds: number
  effortLevel: EffortLevel
}

export type TrainingSessionBase = {
  id: string
  athleteId: string
  date: string
  sessionTitle: string
  notes: string
  createdAt: string
  updatedAt: string
}

export type SwimmingTrainingSession = TrainingSessionBase & {
  trainingType: typeof AttTypeEnum.Swimming
  defaultPoolLength: PoolLength
  blocks: SwimmingSessionBlock[]
}

export type GymTrainingSession = TrainingSessionBase & {
  trainingType: typeof AttTypeEnum.Gym
  blocks: GymSessionBlock[]
}

export type TrainingSession = SwimmingTrainingSession | GymTrainingSession

/** Aggregates for swimming-style training (meters / pace). */
export type DashboardSummary = {
  totalSessions: number
  totalDistanceMeters: number
  totalDurationSeconds: number
  averagePacePer100Seconds: number | null
  currentWeekDistanceMeters: number
}

/** Aggregates for gym-style training. */
export type GymDashboardSummary = {
  sessionCount: number
  totalDurationSeconds: number
  currentWeekDurationSeconds: number
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

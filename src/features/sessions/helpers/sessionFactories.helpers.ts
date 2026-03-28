import {
  AthleteTrainingType,
  DrillType,
  EffortLevel,
  GymBlockCategory,
  PoolLength,
  Stroke,
  SwimmingBlockCategory,
} from '@/shared/domain'
import {
  NEW_GYM_BLOCK_DEFAULT_DURATION_SECONDS,
  NEW_SWIM_BLOCK_DEFAULT_DURATION_SECONDS,
  NEW_SWIM_BLOCK_DEFAULT_EXPLICIT_METERS,
} from '@/shared/constants/sessionDefaults.constants'
import {
  SESSION_BLOCK_KIND,
  type GymSessionBlock,
  type GymTrainingSession,
  type SwimmingSessionBlock,
  type SwimmingTrainingSession,
} from '@/shared/types/domain.types'

export function createSwimmingSessionBlockId(): string {
  return crypto.randomUUID()
}

export function createEmptySwimmingSessionBlock(
  orderIndex: number,
  defaultPoolLength: PoolLength,
): SwimmingSessionBlock {
  return {
    id: createSwimmingSessionBlockId(),
    orderIndex,
    title: `Part ${orderIndex + 1}`,
    notes: '',
    kind: SESSION_BLOCK_KIND.Swimming,
    category: SwimmingBlockCategory.WarmUp,
    stroke: Stroke.Freestyle,
    effortLevel: EffortLevel.Moderate,
    poolLength: defaultPoolLength,
    repetitions: 0,
    distancePerRepMeters: 0,
    explicitTotalDistanceMeters: NEW_SWIM_BLOCK_DEFAULT_EXPLICIT_METERS,
    durationSeconds: NEW_SWIM_BLOCK_DEFAULT_DURATION_SECONDS,
    drillType: DrillType.None,
    intervalSendoffSeconds: null,
    equipment: [],
  }
}

export function createEmptyGymSessionBlock(orderIndex: number): GymSessionBlock {
  return {
    id: createSwimmingSessionBlockId(),
    orderIndex,
    title: `Part ${orderIndex + 1}`,
    notes: '',
    kind: SESSION_BLOCK_KIND.Gym,
    category: GymBlockCategory.MainLift,
    focus: '',
    durationSeconds: NEW_GYM_BLOCK_DEFAULT_DURATION_SECONDS,
    effortLevel: EffortLevel.Moderate,
  }
}

export function createDraftSwimmingTrainingSession(
  athleteId: string,
  defaultPoolLength: PoolLength,
): SwimmingTrainingSession {
  const now = new Date().toISOString()
  const date = now.slice(0, 10)
  return {
    id: createSwimmingSessionBlockId(),
    athleteId,
    date,
    sessionTitle: '',
    notes: '',
    createdAt: now,
    updatedAt: now,
    trainingType: AthleteTrainingType.Swimming,
    defaultPoolLength,
    blocks: [createEmptySwimmingSessionBlock(0, defaultPoolLength)],
  }
}

export function createDraftGymTrainingSession(athleteId: string): GymTrainingSession {
  const now = new Date().toISOString()
  const date = now.slice(0, 10)
  return {
    id: createSwimmingSessionBlockId(),
    athleteId,
    date,
    sessionTitle: '',
    notes: '',
    createdAt: now,
    updatedAt: now,
    trainingType: AthleteTrainingType.Gym,
    blocks: [createEmptyGymSessionBlock(0)],
  }
}

export function reindexTrainingSessionBlocks<
  T extends { orderIndex: number },
>(blocks: T[]): T[] {
  return blocks.map((block, index) => ({ ...block, orderIndex: index }))
}

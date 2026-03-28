import {
  AthleteTrainingType,
  DrillType,
  GymBlockCategory,
  SwimmingBlockCategory,
} from '@/shared/domain'
import {
  DEFAULT_GYM_SESSION_TITLE,
  DEFAULT_SWIMMING_SESSION_TITLE,
  LEGACY_FLAT_BLOCK_TITLE,
} from '@/shared/constants/sessionDefaults.constants'
import type {
  LegacyGymWorkout,
  LegacySwimmingWorkout,
  LegacyWorkout,
} from '@/shared/types/legacy-workout.types'
import {
  SESSION_BLOCK_KIND,
  type SwimmingSessionBlock,
  type TrainingSession,
} from '@/shared/types/domain.types'

function timestampsFromSessionDate(date: string): { createdAt: string; updatedAt: string } {
  const createdAt = `${date}T12:00:00.000Z`
  return { createdAt, updatedAt: createdAt }
}

function swimmingBlockFromLegacyWorkout(workout: LegacySwimmingWorkout): SwimmingSessionBlock {
  return {
    id: `${workout.id}-block-0`,
    orderIndex: 0,
    title: LEGACY_FLAT_BLOCK_TITLE,
    notes: '',
    kind: SESSION_BLOCK_KIND.Swimming,
    category: SwimmingBlockCategory.MainSet,
    stroke: workout.stroke,
    effortLevel: workout.effortLevel,
    poolLength: workout.poolLength,
    repetitions: 1,
    distancePerRepMeters: workout.distance,
    explicitTotalDistanceMeters: 0,
    durationSeconds: workout.duration,
    drillType: DrillType.None,
    intervalSendoffSeconds: null,
    equipment: [],
  }
}

export function migrateLegacyWorkoutToTrainingSession(
  legacyWorkout: LegacyWorkout,
): TrainingSession {
  const timestamps = timestampsFromSessionDate(legacyWorkout.date)
  if (legacyWorkout.trainingType === AthleteTrainingType.Gym) {
    const gym = legacyWorkout as LegacyGymWorkout

    return {
      id: gym.id,
      athleteId: gym.athleteId,
      date: gym.date,
      sessionTitle: gym.sessionFocus || DEFAULT_GYM_SESSION_TITLE,
      notes: gym.notes,
      createdAt: timestamps.createdAt,
      updatedAt: timestamps.updatedAt,
      trainingType: AthleteTrainingType.Gym,
      blocks: [
        {
          id: `${gym.id}-block-0`,
          orderIndex: 0,
          title: gym.sessionFocus || LEGACY_FLAT_BLOCK_TITLE,
          notes: '',
          kind: SESSION_BLOCK_KIND.Gym,
          category: GymBlockCategory.MainLift,
          focus: gym.sessionFocus,
          durationSeconds: gym.durationSeconds,
          effortLevel: gym.effortLevel,
        },
      ],
    }
  }

  const swim = legacyWorkout as LegacySwimmingWorkout

  return {
    id: swim.id,
    athleteId: swim.athleteId,
    date: swim.date,
    sessionTitle: DEFAULT_SWIMMING_SESSION_TITLE,
    notes: swim.notes,
    createdAt: timestamps.createdAt,
    updatedAt: timestamps.updatedAt,
    trainingType: AthleteTrainingType.Swimming,
    defaultPoolLength: swim.poolLength,
    blocks: [swimmingBlockFromLegacyWorkout(swim)],
  }
}

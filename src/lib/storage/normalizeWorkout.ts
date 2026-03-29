import { AthleteTrainingType, EffortLevel, PoolLength, Stroke } from '@/shared/domain'
import { LEGACY_IMPORT_ATHLETE_ID } from '@/shared/constants/migration.constants'
import type { LegacyWorkout } from '@/shared/types/legacy-workout.types'

export function normalizePersistedLegacyWorkout(
  raw: unknown,
  fallbackAthleteId: string = LEGACY_IMPORT_ATHLETE_ID,
): LegacyWorkout | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }
  const record = raw as Record<string, unknown>
  if (Array.isArray(record.blocks)) {
    return null
  }
  const id = String(record.id ?? '')
  const date = String(record.date ?? '')
  if (!id || !date) {
    return null
  }
  const athleteId = String(record.athleteId ?? fallbackAthleteId)
  const notes = String(record.notes ?? '')

  const trainingTypeRaw = record.trainingType
  if (trainingTypeRaw === AthleteTrainingType.Gym || trainingTypeRaw === 'gym') {
    return {
      id,
      athleteId,
      date,
      notes,
      trainingType: AthleteTrainingType.Gym,
      sessionFocus: String(record.sessionFocus ?? 'Training session'),
      durationSeconds: Math.max(0, Number(record.durationSeconds ?? record.duration ?? 0)),
      effortLevel: (record.effortLevel as EffortLevel) ?? EffortLevel.Moderate,
    }
  }

  if (
    trainingTypeRaw === AthleteTrainingType.Swimming ||
    trainingTypeRaw === 'swimming' ||
    (record.poolLength != null && record.stroke != null)
  ) {
    const distance = Number(record.distance ?? 0)
    const duration = Number(record.duration ?? 0)
    const averagePacePer100 =
      Number(record.averagePacePer100) ||
      (distance > 0 && duration > 0 ? (duration / distance) * 100 : 0)

    return {
      id,
      athleteId,
      date,
      notes,
      trainingType: AthleteTrainingType.Swimming,
      poolLength: Number(record.poolLength) as PoolLength,
      stroke: record.stroke as Stroke,
      distance,
      duration,
      averagePacePer100,
      effortLevel: (record.effortLevel as EffortLevel) ?? EffortLevel.Moderate,
    }
  }

  return null
}

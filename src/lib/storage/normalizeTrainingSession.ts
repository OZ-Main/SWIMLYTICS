import {
  AthleteTrainingType,
  DrillType,
  EffortLevel,
  GymBlockCategory,
  PoolLength,
  Stroke,
  SwimEquipment,
  SwimmingBlockCategory,
} from '@/shared/domain'
import { migrateLegacyWorkoutToTrainingSession } from '@/lib/storage/migrateLegacyWorkoutToSession'
import { LEGACY_IMPORT_ATHLETE_ID } from '@/shared/constants/migration.constants'
import { DEFAULT_SESSION_BLOCK_TITLE } from '@/shared/constants/sessionDefaults.constants'
import { normalizePersistedLegacyWorkout } from '@/lib/storage/normalizeWorkout'
import type {
  GymSessionBlock,
  SwimmingSessionBlock,
  TrainingSession,
} from '@/shared/types/domain.types'
import { SESSION_BLOCK_KIND } from '@/shared/types/domain.types'

function isSwimEquipment(value: unknown): value is SwimEquipment {
  return typeof value === 'string' && (Object.values(SwimEquipment) as string[]).includes(value)
}

function parseSwimmingBlock(
  raw: unknown,
  fallbackPoolLength: PoolLength,
): SwimmingSessionBlock | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }
  const row = raw as Record<string, unknown>
  const id = String(row.id ?? '')
  if (!id) {
    return null
  }
  return {
    id,
    orderIndex: Number(row.orderIndex ?? 0),
    title: String(row.title ?? DEFAULT_SESSION_BLOCK_TITLE),
    notes: String(row.notes ?? ''),
    kind: SESSION_BLOCK_KIND.Swimming,
    category: (row.category as SwimmingBlockCategory) ?? SwimmingBlockCategory.Other,
    stroke: (row.stroke as Stroke) ?? Stroke.Freestyle,
    effortLevel: (row.effortLevel as EffortLevel) ?? EffortLevel.Moderate,
    poolLength: (() => {
      const parsed = Number(row.poolLength)
      return parsed === PoolLength.Meters25 || parsed === PoolLength.Meters50
        ? (parsed as PoolLength)
        : fallbackPoolLength
    })(),
    repetitions: Math.max(0, Number(row.repetitions ?? 0)),
    distancePerRepMeters: Math.max(0, Number(row.distancePerRepMeters ?? 0)),
    explicitTotalDistanceMeters: Math.max(0, Number(row.explicitTotalDistanceMeters ?? 0)),
    durationSeconds: Math.max(0, Number(row.durationSeconds ?? 0)),
    drillType: (row.drillType as DrillType) ?? DrillType.None,
    intervalSendoffSeconds:
      row.intervalSendoffSeconds == null ? null : Math.max(0, Number(row.intervalSendoffSeconds)),
    equipment: Array.isArray(row.equipment) ? row.equipment.filter(isSwimEquipment) : [],
  }
}

function parseGymBlock(raw: unknown): GymSessionBlock | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }
  const row = raw as Record<string, unknown>
  const id = String(row.id ?? '')
  if (!id) {
    return null
  }
  return {
    id,
    orderIndex: Number(row.orderIndex ?? 0),
    title: String(row.title ?? DEFAULT_SESSION_BLOCK_TITLE),
    notes: String(row.notes ?? ''),
    kind: SESSION_BLOCK_KIND.Gym,
    category: (row.category as GymBlockCategory) ?? GymBlockCategory.Other,
    focus: String(row.focus ?? ''),
    durationSeconds: Math.max(0, Number(row.durationSeconds ?? 0)),
    effortLevel: (row.effortLevel as EffortLevel) ?? EffortLevel.Moderate,
  }
}

export function normalizePersistedTrainingSession(
  raw: unknown,
  fallbackAthleteId: string = LEGACY_IMPORT_ATHLETE_ID,
): TrainingSession | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }

  const record = raw as Record<string, unknown>
  const id = String(record.id ?? '')
  const date = String(record.date ?? '')

  if (!id || !date) {
    return null
  }

  if (Array.isArray(record.blocks)) {
    const athleteId = String(record.athleteId ?? fallbackAthleteId)
    const sessionTitle = String(record.sessionTitle ?? record.sessionName ?? 'Session')
    const notes = String(record.notes ?? '')
    const createdAt = String(record.createdAt ?? `${date}T12:00:00.000Z`)
    const updatedAt = String(record.updatedAt ?? createdAt)
    const trainingTypeRaw = record.trainingType

    if (trainingTypeRaw === AthleteTrainingType.Swimming || trainingTypeRaw === 'swimming') {
      const defaultPoolLength = Number(record.defaultPoolLength ?? record.poolLength) as PoolLength
      const poolFallback =
        defaultPoolLength === PoolLength.Meters25 || defaultPoolLength === PoolLength.Meters50
          ? defaultPoolLength
          : PoolLength.Meters25
      const blocks: SwimmingSessionBlock[] = []

      for (const blockRow of record.blocks) {
        const block = parseSwimmingBlock(blockRow, poolFallback)

        if (block) {
          blocks.push(block)
        }
      }

      if (blocks.length === 0) {
        return null
      }

      return {
        id,
        athleteId,
        date,
        sessionTitle,
        notes,
        createdAt,
        updatedAt,
        trainingType: AthleteTrainingType.Swimming,
        defaultPoolLength: poolFallback,
        blocks,
      }
    }

    if (trainingTypeRaw === AthleteTrainingType.Gym || trainingTypeRaw === 'gym') {
      const blocks: GymSessionBlock[] = []
      for (const blockRow of record.blocks) {
        const block = parseGymBlock(blockRow)
        if (block) {
          blocks.push(block)
        }
      }
      if (blocks.length === 0) {
        return null
      }

      return {
        id,
        athleteId,
        date,
        sessionTitle,
        notes,
        createdAt,
        updatedAt,
        trainingType: AthleteTrainingType.Gym,
        blocks,
      }
    }
  }

  const legacyWorkout = normalizePersistedLegacyWorkout(raw, fallbackAthleteId)
  if (legacyWorkout) {
    return migrateLegacyWorkoutToTrainingSession(legacyWorkout)
  }

  return null
}

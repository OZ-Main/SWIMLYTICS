import { z } from 'zod'

import { migrateLegacyWorkoutToTrainingSession } from '@/lib/storage/migrateLegacyWorkoutToSession'
import { normalizePersistedTrainingSession } from '@/lib/storage/normalizeTrainingSession'
import { normalizePersistedLegacyWorkout } from '@/lib/storage/normalizeWorkout'
import {
  AthleteTrainingType,
  DataExportVersion,
  EffortLevel,
  PersonalBestDistance,
  PoolLength,
  Stroke,
} from '@/shared/domain'
import { ATHLETE_GROUP_MAX_LENGTH } from '@/shared/constants/athleteGroup.constants'
import { LEGACY_IMPORT_ATHLETE_ID } from '@/shared/constants/migration.constants'
import type {
  Athlete,
  Coach,
  PersonalBest,
  TrainingSession,
  WorkoutTemplate,
} from '@/shared/types/domain.types'
import type { LegacyWorkout } from '@/shared/types/legacy-workout.types'

const coachSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  createdAt: z.string(),
})

const athleteSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  trainingType: z.nativeEnum(AthleteTrainingType),
  group: z.string().max(ATHLETE_GROUP_MAX_LENGTH).optional().default(''),
  notes: z.string(),
  createdAt: z.string(),
})

const swimmingWorkoutSchema = z.object({
  trainingType: z.literal(AthleteTrainingType.Swimming),
  id: z.string(),
  athleteId: z.string(),
  date: z.string(),
  notes: z.string(),
  poolLength: z.nativeEnum(PoolLength),
  stroke: z.nativeEnum(Stroke),
  distance: z.number(),
  duration: z.number(),
  averagePacePer100: z.number(),
  effortLevel: z.nativeEnum(EffortLevel),
})

const gymWorkoutSchema = z.object({
  trainingType: z.literal(AthleteTrainingType.Gym),
  id: z.string(),
  athleteId: z.string(),
  date: z.string(),
  notes: z.string(),
  sessionFocus: z.string(),
  durationSeconds: z.number(),
  effortLevel: z.nativeEnum(EffortLevel),
})

const workoutV2Schema = z.discriminatedUnion('trainingType', [swimmingWorkoutSchema, gymWorkoutSchema])

const personalBestV2Schema = z.object({
  id: z.string(),
  athleteId: z.string(),
  stroke: z.nativeEnum(Stroke),
  distance: z.nativeEnum(PersonalBestDistance),
  timeSeconds: z.number(),
  date: z.string(),
  notes: z.string(),
})

export const swimlyticsExportV2Schema = z.object({
  version: z.literal(DataExportVersion.V2),
  exportedAt: z.string(),
  coach: coachSchema,
  athletes: z.array(athleteSchema),
  workouts: z.array(workoutV2Schema),
  personalBests: z.array(personalBestV2Schema),
})

export type SwimlyticsExportV2 = z.infer<typeof swimlyticsExportV2Schema>

export const swimlyticsExportV3Schema = z.object({
  version: z.literal(DataExportVersion.V3),
  exportedAt: z.string(),
  coach: coachSchema,
  athletes: z.array(athleteSchema),
  trainingSessions: z.array(z.unknown()),
  personalBests: z.array(personalBestV2Schema),
  workoutTemplates: z.array(z.unknown()).optional(),
})

export type SwimlyticsExportV3 = Omit<
  z.infer<typeof swimlyticsExportV3Schema>,
  'trainingSessions' | 'workoutTemplates'
> & {
  trainingSessions: TrainingSession[]
  workoutTemplates: WorkoutTemplate[]
}

const workoutV1Schema = z.object({
  id: z.string(),
  date: z.string(),
  poolLength: z.nativeEnum(PoolLength),
  stroke: z.nativeEnum(Stroke),
  distance: z.number(),
  duration: z.number(),
  averagePacePer100: z.number(),
  effortLevel: z.nativeEnum(EffortLevel),
  notes: z.string(),
})

const personalBestV1Schema = z
  .object({
    id: z.string(),
    stroke: z.nativeEnum(Stroke).optional(),
    distance: z.nativeEnum(PersonalBestDistance),
    timeSeconds: z.number(),
    date: z.string(),
    notes: z.string(),
  })
  .transform((personalBestV1Row) => ({
    ...personalBestV1Row,
    stroke: personalBestV1Row.stroke ?? Stroke.Freestyle,
  }))

const swimlyticsExportV1Schema = z.object({
  version: z.literal(DataExportVersion.V1),
  exportedAt: z.string(),
  workouts: z.array(workoutV1Schema),
  personalBests: z.array(personalBestV1Schema),
})

export type SwimlyticsExportV1 = z.infer<typeof swimlyticsExportV1Schema>

export type ParsedImport =
  | { ok: true; version: DataExportVersion.V3; data: SwimlyticsExportV3 }
  | { ok: true; version: DataExportVersion.V2; data: SwimlyticsExportV2 }
  | {
      ok: true
      version: DataExportVersion.V1
      data: {
        trainingSessions: TrainingSession[]
        personalBests: PersonalBest[]
      }
    }
  | { ok: false; error: string }

export function buildExportPayloadV3(
  coach: Coach,
  athletes: Athlete[],
  trainingSessions: TrainingSession[],
  personalBests: PersonalBest[],
  workoutTemplates: WorkoutTemplate[],
): SwimlyticsExportV3 {
  return {
    version: DataExportVersion.V3,
    exportedAt: new Date().toISOString(),
    coach,
    athletes,
    trainingSessions,
    personalBests,
    workoutTemplates,
  }
}

export function parseImportPayload(json: unknown): ParsedImport {
  const v3 = swimlyticsExportV3Schema.safeParse(json)
  if (v3.success) {
    const trainingSessions: TrainingSession[] = []
    for (const row of v3.data.trainingSessions) {
      const normalizedSession = normalizePersistedTrainingSession(row)
      if (normalizedSession) {
        trainingSessions.push(normalizedSession)
      }
    }

    const workoutTemplatesRaw = v3.data.workoutTemplates ?? []
    const workoutTemplates = workoutTemplatesRaw as WorkoutTemplate[]
    return {
      ok: true,
      version: DataExportVersion.V3,
      data: {
        ...v3.data,
        trainingSessions,
        workoutTemplates,
      },
    }
  }

  const v2 = swimlyticsExportV2Schema.safeParse(json)
  if (v2.success) {
    return { ok: true, version: DataExportVersion.V2, data: v2.data }
  }

  const v1 = swimlyticsExportV1Schema.safeParse(json)
  if (v1.success) {
    const legacyWorkouts: LegacyWorkout[] = []
    for (const v1WorkoutRow of v1.data.workouts) {
      const normalizedWorkout = normalizePersistedLegacyWorkout(v1WorkoutRow, LEGACY_IMPORT_ATHLETE_ID)
      if (normalizedWorkout) {
        legacyWorkouts.push(normalizedWorkout)
      }
    }

    const trainingSessions = legacyWorkouts.map(migrateLegacyWorkoutToTrainingSession)
    const personalBests: PersonalBest[] = v1.data.personalBests.map((v1PersonalBestRow) => ({
      id: v1PersonalBestRow.id,
      athleteId: LEGACY_IMPORT_ATHLETE_ID,
      stroke: v1PersonalBestRow.stroke,
      distance: v1PersonalBestRow.distance,
      timeSeconds: v1PersonalBestRow.timeSeconds,
      date: v1PersonalBestRow.date,
      notes: v1PersonalBestRow.notes,
    }))
    return {
      ok: true,
      version: DataExportVersion.V1,
      data: { trainingSessions, personalBests },
    }
  }

  return { ok: false, error: 'Invalid SWIMLYTICS export file.' }
}

export function legacyImportAthleteSeed(): Athlete {
  return {
    id: LEGACY_IMPORT_ATHLETE_ID,
    fullName: 'Imported athlete',
    trainingType: AthleteTrainingType.Swimming,
    group: '',
    notes: 'Created from a V1 export (single-athlete backup).',
    createdAt: new Date().toISOString(),
  }
}

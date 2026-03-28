import { z } from 'zod'

import {
  DataExportVersion,
  EffortLevel,
  PersonalBestDistance,
  PoolLength,
  Stroke,
} from '@/shared/domain'
import type { PersonalBest, Workout } from '@/shared/types/domain.types'

const workoutSchema = z.object({
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

const personalBestSchema = z
  .object({
    id: z.string(),
    stroke: z.nativeEnum(Stroke).optional(),
    distance: z.nativeEnum(PersonalBestDistance),
    timeSeconds: z.number(),
    date: z.string(),
    notes: z.string(),
  })
  .transform((p) => ({
    ...p,
    stroke: p.stroke ?? Stroke.Freestyle,
  }))

export const swimlyticsExportSchema = z.object({
  version: z.literal(DataExportVersion.V1),
  exportedAt: z.string(),
  workouts: z.array(workoutSchema),
  personalBests: z.array(personalBestSchema),
})

export type SwimlyticsExport = z.infer<typeof swimlyticsExportSchema>

export function buildExportPayload(
  workouts: Workout[],
  personalBests: PersonalBest[],
): SwimlyticsExport {
  return {
    version: DataExportVersion.V1,
    exportedAt: new Date().toISOString(),
    workouts,
    personalBests,
  }
}

export function parseImportPayload(
  json: unknown,
): { ok: true; data: SwimlyticsExport } | { ok: false; error: string } {
  const parsed = swimlyticsExportSchema.safeParse(json)
  if (!parsed.success) {
    return { ok: false, error: 'Invalid SWIMLYTICS export file.' }
  }
  return { ok: true, data: parsed.data }
}

import { useAthleteStore } from '@/app/store/athleteStore'
import { usePersonalBestsStore } from '@/app/store/personalBestsStore'
import { useTrainingSessionStore } from '@/app/store/trainingSessionStore'
import { STORAGE_KEYS } from '@/lib/storage/storageKeys'
import { normalizePersistedTrainingSession } from '@/lib/storage/normalizeTrainingSession'
import { migrateLegacyWorkoutToTrainingSession } from '@/lib/storage/migrateLegacyWorkoutToSession'
import { normalizePersistedLegacyWorkout } from '@/lib/storage/normalizeWorkout'
import { AthleteTrainingType, Stroke } from '@/shared/domain'
import { ATHLETE_TRAINING_TYPE_LABELS } from '@/shared/constants/athleteTrainingTypeLabels'
import { LEGACY_IMPORT_ATHLETE_ID } from '@/shared/constants/migration.constants'
import type { Athlete, PersonalBest } from '@/shared/types/domain.types'

type PersistedZustandShape<T> = { state?: T }

function parsePersistedJson<T>(raw: string | null): T | null {
  if (!raw) {
    return null
  }
  try {
    const parsed = JSON.parse(raw) as PersistedZustandShape<T>
    return parsed?.state ?? null
  } catch {
    return null
  }
}

function ensureLegacyImportAthleteExists(): void {
  const { athletes, addAthlete } = useAthleteStore.getState()
  const legacyAthleteAlreadyPresent = athletes.some(
    (existingAthlete) => existingAthlete.id === LEGACY_IMPORT_ATHLETE_ID,
  )
  if (legacyAthleteAlreadyPresent) {
    return
  }
  const legacyAthlete: Athlete = {
    id: LEGACY_IMPORT_ATHLETE_ID,
    fullName: 'Imported athlete',
    trainingType: AthleteTrainingType.Swimming,
    notes: `Created when migrating from a previous single-athlete install (${ATHLETE_TRAINING_TYPE_LABELS[AthleteTrainingType.Swimming].toLowerCase()} data).`,
    createdAt: new Date().toISOString(),
  }
  addAthlete(legacyAthlete)
}

/**
 * One-shot migration from v1 single-user keys into v2 multi-athlete model.
 */
export function migrateLegacyStorage(): void {
  const { trainingSessions, replaceAllTrainingSessions } = useTrainingSessionStore.getState()

  if (trainingSessions.length === 0) {
    const legacyWorkoutsJson = localStorage.getItem(STORAGE_KEYS.WORKOUTS_LEGACY_V1)
    const legacyWorkoutState = parsePersistedJson<{ workouts?: unknown[] }>(legacyWorkoutsJson)
    const legacyWorkoutRows = legacyWorkoutState?.workouts
    if (Array.isArray(legacyWorkoutRows) && legacyWorkoutRows.length > 0) {
      const migratedSessions = []
      for (const legacyRow of legacyWorkoutRows) {
        const normalizedSession = normalizePersistedTrainingSession(legacyRow, LEGACY_IMPORT_ATHLETE_ID)
        if (normalizedSession) {
          migratedSessions.push(normalizedSession)
        } else {
          const legacyWorkout = normalizePersistedLegacyWorkout(legacyRow, LEGACY_IMPORT_ATHLETE_ID)
          if (legacyWorkout) {
            migratedSessions.push(migrateLegacyWorkoutToTrainingSession(legacyWorkout))
          }
        }
      }
      if (migratedSessions.length > 0) {
        ensureLegacyImportAthleteExists()
        replaceAllTrainingSessions(migratedSessions)
      }
    }
  }

  const { personalBests, replaceAllPersonalBests } = usePersonalBestsStore.getState()
  if (personalBests.length === 0) {
    const legacyPersonalBestsJson = localStorage.getItem(STORAGE_KEYS.PERSONAL_BESTS_LEGACY_V1)
    const legacyPersonalBestState = parsePersistedJson<{ personalBests?: unknown[] }>(
      legacyPersonalBestsJson,
    )
    const legacyPersonalBestRows = legacyPersonalBestState?.personalBests
    if (Array.isArray(legacyPersonalBestRows) && legacyPersonalBestRows.length > 0) {
      ensureLegacyImportAthleteExists()
      const migratedPersonalBests: PersonalBest[] = legacyPersonalBestRows
        .map((legacyRowUnknown) => {
          if (!legacyRowUnknown || typeof legacyRowUnknown !== 'object') {
            return null
          }
          const legacyFields = legacyRowUnknown as Record<string, unknown>
          if (!legacyFields.id || !legacyFields.date) {
            return null
          }
          return {
            id: String(legacyFields.id),
            athleteId: String(legacyFields.athleteId ?? LEGACY_IMPORT_ATHLETE_ID),
            stroke: (legacyFields.stroke as Stroke) ?? Stroke.Freestyle,
            distance: legacyFields.distance as PersonalBest['distance'],
            timeSeconds: Number(legacyFields.timeSeconds),
            date: String(legacyFields.date),
            notes: String(legacyFields.notes ?? ''),
          }
        })
        .filter((row): row is PersonalBest => row != null)
      if (migratedPersonalBests.length > 0) {
        replaceAllPersonalBests(migratedPersonalBests)
      }
    }
  }
}

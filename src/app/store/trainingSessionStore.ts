import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { migrateLegacyWorkoutToTrainingSession } from '@/lib/storage/migrateLegacyWorkoutToSession'
import { normalizePersistedLegacyWorkout } from '@/lib/storage/normalizeWorkout'
import { normalizePersistedTrainingSession } from '@/lib/storage/normalizeTrainingSession'
import { STORAGE_KEYS } from '@/lib/storage/storageKeys'
import { LEGACY_IMPORT_ATHLETE_ID } from '@/shared/constants/migration.constants'
import type { LegacyWorkout } from '@/shared/types/legacy-workout.types'
import type { TrainingSession } from '@/shared/types/domain.types'

type PersistedZustandWrapper<T> = { state?: T }

function readLegacyWorkoutsFromLocalStorage(): LegacyWorkout[] {
  const raw = localStorage.getItem(STORAGE_KEYS.WORKOUTS)
  if (!raw) {
    return []
  }
  try {
    const parsed = JSON.parse(raw) as PersistedZustandWrapper<{ workouts?: unknown[] }>
    const rows = parsed?.state?.workouts
    if (!Array.isArray(rows)) {
      return []
    }
    const legacyWorkouts: LegacyWorkout[] = []
    for (const row of rows) {
      const legacyWorkout = normalizePersistedLegacyWorkout(row, LEGACY_IMPORT_ATHLETE_ID)
      if (legacyWorkout) {
        legacyWorkouts.push(legacyWorkout)
      }
    }
    return legacyWorkouts
  } catch {
    return []
  }
}

type TrainingSessionState = {
  trainingSessions: TrainingSession[]
  addTrainingSession: (session: TrainingSession) => void
  updateTrainingSession: (session: TrainingSession) => void
  deleteTrainingSession: (sessionId: string) => void
  replaceAllTrainingSessions: (nextSessions: TrainingSession[]) => void
}

export const useTrainingSessionStore = create<TrainingSessionState>()(
  persist(
    (setState, getState) => ({
      trainingSessions: [],
      addTrainingSession: (session) =>
        setState({ trainingSessions: [session, ...getState().trainingSessions] }),
      updateTrainingSession: (updatedSession) =>
        setState({
          trainingSessions: getState().trainingSessions.map((existingSession) =>
            existingSession.id === updatedSession.id ? updatedSession : existingSession,
          ),
        }),
      deleteTrainingSession: (sessionId) =>
        setState({
          trainingSessions: getState().trainingSessions.filter(
            (existingSession) => existingSession.id !== sessionId,
          ),
        }),
      replaceAllTrainingSessions: (nextSessions) => setState({ trainingSessions: nextSessions }),
    }),
    {
      name: STORAGE_KEYS.TRAINING_SESSIONS,
      storage: createJSONStorage(() => localStorage),
      partialize: (persistedSlice) => ({
        trainingSessions: persistedSlice.trainingSessions,
      }),
      merge: (persistedState, currentState): TrainingSessionState => {
        const slice = persistedState as { trainingSessions?: unknown[] } | undefined
        if (
          slice?.trainingSessions &&
          Array.isArray(slice.trainingSessions) &&
          slice.trainingSessions.length > 0
        ) {
          const normalizedSessions: TrainingSession[] = []
          for (const persistedRow of slice.trainingSessions) {
            const normalizedSession = normalizePersistedTrainingSession(
              persistedRow,
              LEGACY_IMPORT_ATHLETE_ID,
            )
            if (normalizedSession) {
              normalizedSessions.push(normalizedSession)
            }
          }
          if (normalizedSessions.length > 0) {
            return {
              ...currentState,
              trainingSessions: normalizedSessions,
            }
          }
        }
        return mergeFromLegacyWorkoutsBucket(currentState)
      },
    },
  ),
)

function mergeFromLegacyWorkoutsBucket(currentState: TrainingSessionState): TrainingSessionState {
  const legacyWorkouts = readLegacyWorkoutsFromLocalStorage()
  if (legacyWorkouts.length === 0) {
    return currentState
  }
  localStorage.removeItem(STORAGE_KEYS.WORKOUTS)
  const migratedSessions = legacyWorkouts.map((legacyWorkout) =>
    migrateLegacyWorkoutToTrainingSession(legacyWorkout),
  )
  return {
    ...currentState,
    trainingSessions: migratedSessions,
  }
}

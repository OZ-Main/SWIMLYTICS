import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { STORAGE_KEYS } from '@/lib/storage/storageKeys'
import { DEFAULT_LOCAL_COACH_ID } from '@/shared/constants/migration.constants'
import type { Coach } from '@/shared/types/domain.types'

function createDefaultCoach(): Coach {
  return {
    id: DEFAULT_LOCAL_COACH_ID,
    displayName: 'Coach',
    createdAt: new Date().toISOString(),
  }
}

type CoachState = {
  coach: Coach
  setCoachDisplayName: (displayName: string) => void
  replaceCoach: (nextCoach: Coach) => void
}

export const useCoachStore = create<CoachState>()(
  persist(
    (setState) => ({
      coach: createDefaultCoach(),
      setCoachDisplayName: (displayName) =>
        setState((previousState) => ({
          coach: { ...previousState.coach, displayName },
        })),
      replaceCoach: (nextCoach) => setState({ coach: nextCoach }),
    }),
    {
      name: STORAGE_KEYS.COACH,
      storage: createJSONStorage(() => localStorage),
      partialize: (persistedSlice) => ({ coach: persistedSlice.coach }),
      merge: (persistedState, currentState) => {
        if (persistedState == null || typeof persistedState !== 'object') {
          return currentState
        }
        const persistedCoachSlice = persistedState as Partial<CoachState>
        return {
          ...currentState,
          coach: persistedCoachSlice.coach?.id
            ? persistedCoachSlice.coach
            : createDefaultCoach(),
        }
      },
    },
  ),
)
